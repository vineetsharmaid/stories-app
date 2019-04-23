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
        

        $this->db->select('stories.preview_title, stories.preview_subtitle, stories.created, stories.story_id, stories.author_id, stories.featured, users.first_name, users.last_name, users.username');
        $this->db->from('stories');
        $this->db->join('users', 'users.user_id = stories.author_id');
        $this->db->where( $where );
        $this->db->group_by( 'stories.story_id' );
        return $this->db->get()->result();
    }

    public function get_comments($where='') {
        

        $this->db->select('comments.*, users.first_name, users.last_name, users.username, stories.preview_title');
        $this->db->from('comments');
        $this->db->join('users', 'users.user_id = comments.user_id');
        $this->db->join('stories', 'stories.story_id = comments.story_id');
        $this->db->where( $where );
        $this->db->group_by( 'comments.comment_id' );
        return $this->db->get()->result();
    }

    public function get_forum_comments($where='') {
        

        $this->db->select('forum_answer_comments.*, users.first_name, users.last_name, users.username, forum_answers.subject as answer, forum_questions.title as question, forum_questions.slug, forum_questions.question_id');
        $this->db->from('forum_answer_comments');
        $this->db->join('users', 'users.user_id = forum_answer_comments.user_id');
        $this->db->join('forum_answers', 'forum_answers.answer_id = forum_answer_comments.answer_id');
        $this->db->join('forum_questions', 'forum_questions.question_id = forum_answers.question_id');
        $this->db->where( $where );
        $this->db->group_by( 'forum_answer_comments.comment_id' );
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