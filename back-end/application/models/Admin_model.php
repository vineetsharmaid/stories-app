<?php 

class Admin_model extends CI_Model {

 
    public function get_users()
    {

        $this->db->select('users.first_name, users.last_name, users.profile_pic, users.user_email, users.user_type, users.username, users.created, status.name as status');
        $this->db->from('users');
        $this->db->join('status', 'users.status = status.id', 'left');
        $this->db->where('users.user_type = "user"'); 
        return $this->db->get()->result();
        
    }

    public function get_categories()
    {
        
        $this->db->select('categories.*, parent_categories.name as parent_name');
        $this->db->from('categories');
        $this->db->join('categories as parent_categories', 'parent_categories.cat_id = categories.parent', 'left');
        return $this->db->get()->result();
    }


    public function get_category($cat_id)
    {
        
        $this->db->select('categories.*, parent_categories.name as parent_name, is_a_parent_categories.cat_id as child');
        $this->db->from('categories');
        // join to get name of the parent category
        $this->db->join('categories as parent_categories', 'parent_categories.cat_id = categories.parent', 'left');
        // join to check if current category is a parent category
        $this->db->join('categories as is_a_parent_categories', 'is_a_parent_categories.parent = categories.cat_id', 'left');
        $this->db->where( array('categories.cat_id' => $cat_id) );
        $this->db->group_by('categories.cat_id');
        return $this->db->get()->result();
    }

    public function get_parent_categories($cat_id)
    {

        $where = array('categories.parent' => 0, 'categories.status' => 1, 'categories.cat_id !=' => $cat_id);
        
        $this->db->select('categories.*, parent_categories.name as parent_name');
        $this->db->from('categories');
        $this->db->join('categories as parent_categories', 'parent_categories.cat_id = categories.parent', 'left');
        $this->db->where($where);
        return $this->db->get()->result();
    }

    public function get_stories($where='') {
        

        $this->db->select('stories.preview_title, stories.preview_subtitle, stories.created, stories.story_id, stories.author_id, users.first_name, users.last_name, users.username');
        $this->db->from('stories');
        $this->db->join('users', 'users.user_id = stories.author_id');
        $this->db->where( $where );
        $this->db->group_by( 'stories.story_id' );
        return $this->db->get()->result();
    }

    public function get_story($where='') {
        

        $this->db->select('stories.*, users.first_name, users.last_name, users.username');
        $this->db->from('stories');
        $this->db->join('users', 'users.user_id = stories.author_id');
        $this->db->where( $where );
        return $this->db->get()->result();
    }
}