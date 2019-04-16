<?php 

class User_model extends CI_Model {

    public function get_user_info($where) {

      $this->db->select("users.first_name, users.last_name, users.profile_pic, users.user_email, users.user_type, users.username, users.cover_pic, 
        max(case when usermeta.meta_key='professional_info' then usermeta.meta_value end) as professional_info,
        max(case when usermeta.meta_key='short_info' then usermeta.meta_value end) as short_info,
        max(case when usermeta.meta_key='website' then usermeta.meta_value end) as website,
        ");
      $this->db->from('users');
      $this->db->join('usermeta', 'usermeta.user_id = users.user_id', 'left');
      $this->db->where( $where );
      $this->db->group_by( 'users.user_id' );
      return $this->db->get()->result();
    }
}