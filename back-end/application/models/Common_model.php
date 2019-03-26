<?php 

class Common_model extends CI_Model {

    public function insert_entry($table, $data) {
        
        return $this->db->insert($table, $data);
    }

    public function update_entry($table, $data, $where) {
        
        return $this->db->update($table, $data, $where);
    }

    public function get_data($table, $where="") {
    	
        if ( $where == "" ) {
            
            return $this->db->get($table)->result();
        } else {

            return $this->db->get_where($table, $where)->result();
        }
    }

    public function user_exists($table, $where)
    {
    		return $this->db->get_where( $table, $where )->num_rows();
    }

    public function get_users()
    {

        $this->db->select('users.first_name, users.last_name, users.profile_pic, users.user_email, users.user_type, users.username, users.created, status.name as status');
        $this->db->from('users');
        $this->db->join('status', 'users.status = status.id'); 
        $this->db->where('users.user_type = "user"'); 
        return $this->db->get()->result();
        
    }
}