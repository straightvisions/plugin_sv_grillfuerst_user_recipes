<?php

namespace SV_Grillfuerst_User_Recipes\Interfaces;
use Psr\Http\Message\ServerRequestInterface;

interface Request_Interface extends ServerRequestInterface{
    public function __invoke($request);
}