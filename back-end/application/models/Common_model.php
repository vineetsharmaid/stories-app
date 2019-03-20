<?php 

class Common_model extends CI_Model {

    public function insert_entry($table, $data)
    {
        return $this->db->insert($table, $data);
    }

    public function update_entry($table, $data, $where)
    {
        $this->db->update($table, $data, $where);
    }

}