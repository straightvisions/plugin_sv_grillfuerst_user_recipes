<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Email;

use Psr\Container\ContainerInterface;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use RuntimeException;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Throwable;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Source;
use Psr\Log\LoggerInterface;

class Email_Middleware {
    private MailerInterface $mailer;
    private Environment $twig;
    private LoggerInterface $logger;
    private $settings;

    public function __construct(
        MailerInterface $mailer,
        Environment $twig,
        Logger_Factory $Logger_Factory,
        ContainerInterface $container
    ) {
        $this->mailer = $mailer;
        $this->twig   = $twig;
        $this->logger = $Logger_Factory
            ->addFileHandler('emailer.log')
            ->createLogger();
        $this->settings = $container->get('settings')['mailer'];
    }

    public function send(array $data): array {
        $errors = [];

        try {
            $from = new Address(isset($data['from']) ? $data['from'] : $this->settings['from']);
            $to   = new Address($data['to']);

            $email = (new Email())
                ->from($from)
                ->to($to)
                ->subject($data['subject'])
                ->html($this->render($data));

            if ($this->settings['mode'] === 'smtp') {
                $this->sendMail($email); //if this is not working with smtp - use this: $this->sendMailSMTP($email);
            } elseif ($this->settings['mode'] === 'wordpress') {
                $this->sendMailWordPress($email, $data);
            } else {
                $this->sendMail($email);
            }

            $this->logger->info('Email sent successfully', $data);
        } catch (Throwable $exception) {
            $this->logger->error($exception->getMessage(), $data);
            $errors[] = 'Email konnte nicht gesendet werden';
        }

        return $errors;
    }

    private function sendMail(Email $email): void {
        $this->mailer->send($email);
    }

    private function sendMailSMTP(Email $email): void {
        // SMTP configuration
        $smtpHost = $this->settings['smtp']['host'];
        $smtpPort = $this->settings['smtp']['port'];
        $smtpUsername = $this->settings['smtp']['username'];
        $smtpPassword = $this->settings['smtp']['password'];

        $transport = new \Symfony\Component\Mailer\Transport\Smtp\SmtpTransport($smtpHost, $smtpPort);
        $transport->setUsername($smtpUsername);
        $transport->setPassword($smtpPassword);

        // Create the Mailer using the SMTP transport
        $mailer = new Mailer($transport);

        // Send the email using the configured Mailer
        $mailer->send($email);
    }

    private function sendMailWordPress(Email $email, array $data): void {
        $recipients = array_merge(
            $email->getTo(),
            $email->getCc(),
            $email->getBcc()
        );

        $to = array_map(function ($recipient) {
            return $recipient->getAddress();
        }, $recipients);

        $subject = $email->getSubject();
        $message = $this->render($data);

        $from = $this->settings['from'];

        if(isset($this->settings['from_name']) && !empty($this->settings['from_name'])){
            $from = $this->settings['from_name'].' <'.$from.'>';
        }

        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            'From: '.$from
        );

        $result = \wp_mail($to, $subject,  $message, $headers);

        if ($result) {
            // Email sent successfully
            $this->logger->info('Email sent successfully', $data);
        } else {
            // Failed to send email
            $this->logger->error('Failed to send email', $data);
            $errors[] = 'Email konnte nicht gesendet werden';
        }
    }

    private function render(array $params): string {
        return $this->twig->render($this->getTemplate((string)$params['template']), $params);
    }

    private function getTemplate(string $templateName): string {
        $templateName = 'Email/'.$templateName . '.html.twig';
        $defaultTemplate = 'Email/default.html.twig';

        try {
            $twigSource = $this->twig->getLoader()->getSourceContext($templateName);
        } catch (LoaderError $e) {
            $twigSource = new Source('', $defaultTemplate);
        }

        return $twigSource->getName();
    }
}
