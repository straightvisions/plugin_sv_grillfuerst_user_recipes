<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Email;

use Psr\Container\ContainerInterface;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use RuntimeException;
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
        $from = new Address(isset($data['from']) ? $data['from'] : $this->settings['from']);
        $to   = new Address($data['to']);

        $email = (new Email())
            ->from($from)
            ->to($to)
            ->subject($data['subject'])
            ->html($this->render($data));

        try {
            $this->mailer->send($email);
            $this->logger->info('Email sent successfully', $data);
        } catch (Throwable $exception) {
            $this->logger->error($exception->getMessage(), $data);
            //throw new RuntimeException('Failed to send email');
            $errors[] = 'Email konnte nicht gesendet werden';
        }

        return $errors;
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
