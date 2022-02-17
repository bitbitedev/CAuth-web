<?php

require("dbconf.php");

class databaseManager {

	private $host = DB_HOST;
	private $username = DB_USERNAME;
	private $password = DB_PASSWORD;
	private $database = DB_DATABASE;
	private $con = null;

	public function __construct() {
		$this->connectToDatabase();
	}

	public function getConnection() {
		return $this->con;
	}

	public function connectToDatabase() {
		@$this->con = new mysqli($this->host, $this->username, $this->password, $this->database);
		if ($this->con->connect_errno) {
			echo "Can't connect to database.\n";
			echo $this->con->connect_error;
			exit();
		}
	}

	public function get($query, $param = null, ...$args) {
		$stmt = $this->con->prepare($query);
		if(!$stmt){
			return false;
		}
		if($param != null){
			$stmt->bind_param($param, ...$args);
		}
		if($stmt->execute()) {
			$result = $stmt->get_result();
			if(!$result){
				return false;
			}
			return $result->fetch_assoc();
		} else {
			return false;
		}
	}

	public function getArray($query, $param = null, ...$args) {
		$stmt = $this->con->prepare($query);
		if(!$stmt){
			return false;
		}
		if($param != null){
			$stmt->bind_param($param, ...$args);
		}
		if($stmt->execute()) {
			$result = $stmt->get_result();
			$rows = array();
			while($row = $result->fetch_array(MYSQLI_BOTH)) {
				$rows[] = $row;
			}
			return $rows;
		} else {
			return false;
		}
	}

	public function update($tbl, $set, $where, $param, ...$args) {
		$stmt = $this->con->prepare("UPDATE " . $tbl . " SET " . $set . " WHERE " . $where);
		if(!$stmt){
			return false;
		}
		$stmt->bind_param($param, ...$args);
		return $stmt->execute();
	}

	public function delete($tbl, $where, $param, ...$args) {
		$stmt = $this->con->prepare("DELETE FROM " . $tbl . " WHERE " . $where);
		if(!$stmt){
			return false;
		}
		$stmt->bind_param($param, ...$args);
		return $stmt->execute();
	}

	public function insert($tbl, $fields, $values, $param, ...$args) {
		$stmt = $this->con->prepare("INSERT INTO " . $tbl . " " . $fields . " VALUES " . $values);
		if(!$stmt){
			return false;
		}
		if($stmt === FALSE){
			echo mysqli_error($this->con);
		} else {
			$stmt->bind_param($param, ...$args);
			return $stmt->execute();
		}
	}
}
