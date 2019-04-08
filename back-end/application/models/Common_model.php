<?php 

class Common_model extends CI_Model {

    public function insert_entry($table, $data) {
        
        return $this->db->insert($table, $data);
    }

    public function update_entry($table, $data, $where) {
        
        return $this->db->update($table, $data, $where);
    }

    public function delete_entry($table, $where) {
        
        return $this->db->delete($table, $where);
    }

    public function get_data($table, $where="") {
    	
        if ( $where == "" ) {
            
            return $this->db->get($table)->result();
        } else {

            return $this->db->get_where($table, $where)->result();
        }
    }

    public function data_exists($table, $where)
    {
    		return $this->db->get_where( $table, $where )->num_rows();
    }

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

    public function get_searched_tags($filter_value)
    {

        $this->db->select('*');
        $this->db->from('tags');
        $this->db->like('name', $filter_value, 'after');     // Produces: WHERE `name` LIKE 'filter_value%' ESCAPE '!'
        return $this->db->get()->result();
    }
    
    public function get_story($story_id)
    {
        
        $this->db->select('stories.*, GROUP_CONCAT(story_tags.tag_id SEPARATOR ",") AS tag_ids');
        $this->db->from('stories');
        $this->db->join('story_tags', 'story_tags.story_id = stories.story_id');
        $this->db->where( array('stories.story_id' => $story_id) );
        return $this->db->get()->result();
    }

    public function get_stories($where='') {
        

        $this->db->select('stories.preview_title, stories.preview_subtitle, stories.preview_image, stories.slug, stories.created, stories.story_id, stories.author_id, users.first_name, users.last_name, users.username');
        $this->db->from('stories');
        $this->db->join('users', 'users.user_id = stories.author_id');
        $this->db->where( $where );
        $this->db->group_by( 'stories.story_id' );
        return $this->db->get()->result();
    }

    public function get_story_data($where='', $user_id='') {
        
        if ( $user_id == '' ) {
          
          $this->db->select('stories.*, users.first_name, users.last_name, users.username');
          $this->db->from('stories');
          $this->db->join('users', 'users.user_id = stories.author_id');
          $this->db->where( $where );
          $this->db->group_by( 'stories.story_id' );
          return $this->db->get()->result();
        } else {

          $this->db->select('stories.*, users.first_name, users.last_name, users.username, story_user_likes.user_id as liked_by');
          $this->db->from('stories');
            
          $this->db->join('users', 'users.user_id = stories.author_id');
          $this->db->join('story_user_likes', 'story_user_likes.story_id = stories.story_id AND story_user_likes.user_id = '.$user_id.'', 'left');

          $this->db->where( $where );
          $this->db->group_by( 'stories.story_id' );
          return $this->db->get()->result();
        }
    }


    public function get_story_tags($story_id)
    {
        
        $this->db->select('stories.story_id, story_tags.tag_id, tags.name, tags.status');
        $this->db->from('stories');
        $this->db->join('story_tags', 'story_tags.story_id = stories.story_id');
        $this->db->join('tags', 'tags.tag_id = story_tags.tag_id');
        $this->db->where( array('stories.story_id' => $story_id, 'tags.status' => 1) );
        return $this->db->get()->result();
    }

    public function get_story_comments($parent, $story_id)
    {
      $this->db->select('comments.*, users.first_name, users.last_name, users.username, users.username, users.profile_pic, users.user_type');
      $this->db->from('comments');
      $this->db->join('users', 'users.user_id = comments.user_id');
      $this->db->where( array('comments.parent' => $parent, 'comments.story_id' => $story_id,'comments.approved' => 1) );
      $comments = $this->db->get()->result();

      return $comments;
    }

    public function get_story_comments_for_user($parent, $story_id, $user_id)
    {
      $this->db->select('comments.*, users.first_name, users.last_name, users.username, users.username, users.profile_pic, users.user_type');
      $this->db->from('comments');
      $this->db->join('users', 'users.user_id = comments.user_id');
      $this->db->where( "`comments.parent` = ".$parent." AND `comments.story_id` = ".$story_id." AND (`comments`.`approved` = 1 OR `comments`.`user_id` = ".$user_id." )" );
      $comments = $this->db->get()->result();

      return $comments;
    }

    public function get_comment_by_id($comment_id)
    {
      $this->db->select('comments.*, users.first_name, users.last_name, users.username, users.username, users.profile_pic, users.user_type');
      $this->db->from('comments');
      $this->db->join('users', 'users.user_id = comments.user_id');
      $this->db->where( array('comments.comment_id' => $comment_id) );
      $comments = $this->db->get()->row();

      return $comments;
    }


}