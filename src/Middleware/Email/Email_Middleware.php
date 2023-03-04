<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Email;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class Email_Middleware implements Middleware_Interface {
    private $mailer;
    private $twig;

    private $data = [
      'from'=>'',
      'to'=>'',
      'subject'=>'',
      'body'=>'',
    ];

    public function __construct(MailerInterface $mailer, Environment $twig) {
        $this->mailer = $mailer;
        $this->twig   = $twig;
    }

    public function send(string $type = 'default') {
        $d = $this->data;

        $email = (new Email())
            ->from($d['from'])
            ->to($d['to'])
            ->subject($d['subject'])
            ->html(
                $this->render($type, [
                    'subject' => $d['subject'],
                    'content' => $d['body']
                ])
            );

        $this->mailer->send($email);
    }

    private function render(string $type, array $params): string {
        $type = 'published';
        $type = $this->isTemplate($type) ? $type : 'default';
        return  $this->twig->render('Template/'.$type.'.html.twig', $params) ;
    }

    private function isTemplate(string $type): bool{
        return file_exists(__DIR__.'/Template/'.$type.'.html.twig');
    }

    public function set(string $field, string $value): void{
        if(isset($this->data[$field])){
            $this->data[$field] = $value;
        }
    }

    public function get(string $field): string{
        return isset($this->data[$field]) ? $this->data['field'] : '';
    }
}
