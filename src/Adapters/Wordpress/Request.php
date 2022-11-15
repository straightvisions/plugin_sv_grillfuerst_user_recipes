<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;

use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use SV_Grillfuerst_User_Recipes\Interfaces\Request_Interface;
use WP_REST_Request;

final class Request implements Request_Interface {
    private WP_REST_Request $request;

    // invokes don't work with chaining?
    public function __invoke($request) {
        $this->request = $request;

        return $this;
    }

    public function set($request){
        $this->request = $request;

        return $this;
    }


    // have to use camel case due the interface implementation
    // interface methods
    public function getProtocolVersion() {
        // TODO: Implement getProtocolVersion() method.
    }

    public function withProtocolVersion($version) {
        // not implemented
        return null;
    }

    public function getHeaders() {
        return $this->request->get_headers();
    }

    public function hasHeader($name) {
        return $this->request->get_header($name) ? true : false;
    }

    public function getHeader($name) {
        return $this->request->get_header($name);
    }

    public function getHeaderLine($name) {
        // not implemented
        return null;
    }

    public function withHeader($name, $value) {
        // not implemented
        return null;
    }

    public function withAddedHeader($name, $value) {
        // not implemented
        return null;
    }

    public function withoutHeader($name) {
        // not implemented
        return null;
    }

    public function getBody() {
        return $_REQUEST;
    }

    public function withBody(StreamInterface $body) {
        // not implemented
        return null;
    }

    public function getRequestTarget() {
        // not implemented
        return null;
    }

    public function withRequestTarget($requestTarget) {
        // not implemented
        return null;
    }

    public function getMethod() {
        return $this->request->get_method();
    }

    public function withMethod($method) {
        // not implemented
        return null;
    }

    public function getUri() {
        // not implemented
        return null;
    }

    public function withUri(UriInterface $uri, $preserveHost = false) {
        // not implemented
        return null;
    }

    public function getServerParams() {
        // not implemented
        return null;
    }

    public function getCookieParams() {
        // not implemented
        return null;
    }

    public function withCookieParams(array $cookies) {
        // not implemented
        return null;
    }

    public function getQueryParams() {
        // not implemented
        return null;
    }

    public function withQueryParams(array $query) {
        // not implemented
        return null;
    }

    public function getUploadedFiles() {
        return $this->request->get_file_params();
    }

    public function withUploadedFiles(array $uploadedFiles) {
        // not implemented
        return null;
    }

    public function getParsedBody() {
        return $this->request->get_body();
    }

    public function getJSONParams(){
        return $this->request->get_json_params();
    }

    public function withParsedBody($data) {
        // not implemented
        return null;
    }

    public function getAttributes() {
        return $this->request->get_attributes();
    }

    public function getAttribute($name, $default = null) {
        // not implemented
        return  isset($this->request[$name]) ? $this->request[$name] : $default;
    }

    public function withAttribute($name, $value) {
        // not implemented
        return null;
    }

    public function withoutAttribute($name) {
        // not implemented
        return null;
    }

}