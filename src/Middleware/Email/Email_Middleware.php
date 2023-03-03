<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Email;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class Email_Middleware implements Middleware_Interface {
    private $mailer;
    private $twig;

    public function __construct(MailerInterface $mailer, Environment $twig) {
        $this->mailer = $mailer;
        $this->twig   = $twig;
    }

    public function __invoke($request) {
        $email = (new Email())
            ->from('sender@example.com')
            ->to('recipient@example.com')
            ->subject('Example Email')
            ->html(
                $this->render([
                    'subject' => 'Example Email',
                    'content' => 'This is an example email.'
                ])
            );

        $this->mailer->send($email);
    }

    private function render(array $params): string {
        $type = 'published';
        return $this->twig->render('template/.'.$type.'.html.twig', $params);
    }
}
