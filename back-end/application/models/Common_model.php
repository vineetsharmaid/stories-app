<?php 

class Common_model extends CI_Model {

    public function insert_entry($table, $data) {
        
        return $this->db->insert($table, $data);
    }

    public function update_entry($table, $data, $where) {
        
        return $this->db->update($table, $data, $where);
    }

    public function get_entry($table, $where) {
    	
        return $this->db->get_where($table, $where)->result();
    }

    public function user_exists($table, $where)
    {
    		return $this->db->get_where( $table, $where )->num_rows();
    }
}