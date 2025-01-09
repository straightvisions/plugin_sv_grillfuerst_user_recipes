<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;

use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use SV_Grillfuerst_User_Recipes\Interfaces\Request_Interface;
use WP_REST_Request;

final class Request implements Request_Interface {
	private WP_REST_Request $request;

	public function __invoke($request) {
		$this->request = $request;
		return $this;
	}

	public function set($request) {
		$this->request = $request;
		return $this;
	}

	// Pagination Helper: Get the current page
	public function getPage(): int {
		$page = $this->request->get_param('page');
		return max(1, (int) $page); // Ensure the page is at least 1
	}

	// Pagination Helper: Get the limit
	public function getLimit(int $default = 10, int $max = 100): int {
		$limit = $this->request->get_param('limit');
		$limit = max(1, (int) $limit); // Ensure at least 1
		return min($limit, $max); // Enforce a maximum limit
	}

	// Get query for filtering
	public function getQuery(string $key, $default = null) {
		$params = $this->getParams();
		return $params[$key] ?? $default;
	}

	// Get all filters as an associative array
	public function getFilters(): array {
		$filters = [];
		$params = $this->getParams();
		if (isset($params['filter']) && is_array($params['filter'])) {
			foreach ($params['filter'] as $filter) {
				if (isset($filter['key'], $filter['value'])) {
					$filters[$filter['key']] = $filter['value'];
				}
			}
		}
		return $filters;
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
		$body = $this->request->get_body();

		// return array if json body
		try {
			$body = (array) json_decode($body);
			return $body;
		} catch (\Exception $e) {

		}

		return $this->request->get_body();
	}

	public function getJSONParams(): array{
		return (array) $this->request->get_json_params();
	}

	public function getParams(): array{
		return $this->parseParams($this->request->get_params());
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

	private function parseParams(array|null $params = []){
		foreach ($params as $key => $value) {
			$decodedValue = json_decode($value, true);
			// Check if json_decode() was successful and the value is not null
			if ($decodedValue !== null && json_last_error() === JSON_ERROR_NONE) {
				$params[$key] = $decodedValue; // Replace the string with its decoded array
			}
		}

		return $params;
	}

}