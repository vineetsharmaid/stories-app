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
        

        $this->db->select('stories.preview_title, stories.preview_subtitle, stories.created, stories.story_id, stories.slug, stories.author_id, stories.featured, users.first_name, users.last_name, users.username, count(distinct story_user_views.user_id) as total_views, count(distinct story_user_shares.share_id) as total_shares, count(distinct story_user_likes.user_id) as total_likes, count(distinct comments.user_id) as total_comments');
        $this->db->from('stories');
        $this->db->join('users', 'users.user_id = stories.author_id');
        $this->db->join('story_user_views', 'story_user_views.story_id = stories.story_id', 'left');
        $this->db->join('story_user_likes', 'story_user_likes.story_id = stories.story_id', 'left');
        $this->db->join('story_user_shares', 'story_user_shares.story_id = stories.story_id', 'left');
        $this->db->join('comments', 'comments.story_id = stories.story_id AND comments.approved = 1', 'left');
        $this->db->where( $where );
        $this->db->group_by( 'stories.story_id' );
        return $this->db->get()->result();
    }

    public function get_flagged_stories() {
        
        $this->db->select('stories.preview_title, stories.preview_subtitle, stories.status, stories.created, stories.story_id, stories.slug, stories.author_id, stories.featured, authorUser.first_name as author_first_name, authorUser.last_name as author_last_name, authorUser.username as author_username, reporterUser.first_name as reporter_first_name, reporterUser.last_name as reporter_last_name, reporterUser.username as reporter_username, flagged_posts.flagged_by as reporter_id, count(distinct story_user_views.user_id) as total_views, count(distinct story_user_shares.share_id) as total_shares, count(distinct story_user_likes.user_id) as total_likes, count(distinct comments.user_id) as total_comments');
        $this->db->from('stories');
        $this->db->join('flagged_posts', 'flagged_posts.post_id = stories.story_id');
        $this->db->join('users as reporterUser', 'reporterUser.user_id = flagged_posts.flagged_by');
        $this->db->join('users as authorUser', 'authorUser.user_id = stories.author_id');
        $this->db->join('story_user_views', 'story_user_views.story_id = stories.story_id', 'left');
        $this->db->join('story_user_likes', 'story_user_likes.story_id = stories.story_id', 'left');
        $this->db->join('story_user_shares', 'story_user_shares.story_id = stories.story_id', 'left');        
        $this->db->join('comments', 'comments.story_id = stories.story_id AND comments.approved = 1', 'left');
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

    public function get_questions($where='')
    {
        
        $this->db->select('forum_questions.*, 
          users.first_name, users.last_name, users.username, users.profile_pic, 
          GROUP_CONCAT(distinct topics.name ORDER BY topics.topic_id) as topics, 
          GROUP_CONCAT(distinct topics.topic_id ORDER BY topics.topic_id) as topic_ids');
        $this->db->from('forum_questions');        
        // get topics tagged with question
        $this->db->join('thread_topics', 'thread_topics.thread_id = forum_questions.question_id', 'left');
        // get names of topics
        $this->db->join('topics', 'topics.topic_id = thread_topics.topic_id', 'left');        
        // get answer author information
        $this->db->join('users', 'users.user_id = forum_questions.author_id', 'left');
        $this->db->where( $where );
        $this->db->group_by('forum_questions.question_id');
        return $this->db->get()->result();
    }

    public function get_answers($where='')
    {

        $this->db->select('forum_answers.*, forum_questions.title,
          users.first_name, users.last_name, users.username, users.profile_pic');
        $this->db->from('forum_answers');        
        // get answer author information
        $this->db->join('forum_questions', 'forum_questions.question_id = forum_answers.question_id');
        $this->db->join('users', 'users.user_id = forum_answers.author_id', 'left');
        $this->db->where($where);
        $this->db->group_by('forum_answers.answer_id');        
        return $this->db->get()->result();
    }

    public function get_flagged_answers($where='')
    {

        $this->db->select('forum_answers.*, forum_questions.title, authorUser.first_name as author_first_name, authorUser.last_name as author_last_name, authorUser.username as author_username, reporterUser.first_name as reporter_first_name, reporterUser.last_name as reporter_last_name, reporterUser.username as reporter_username, forum_answer_user_flagged.user_id as reporter_id');
        $this->db->from('forum_answers');
        // get answer author information
        $this->db->join('forum_questions', 'forum_questions.question_id = forum_answers.question_id');
        $this->db->join('forum_answer_user_flagged', 'forum_answer_user_flagged.answer_id = forum_answers.answer_id');
        $this->db->join('users as reporterUser', 'reporterUser.user_id = forum_answer_user_flagged.user_id');
        $this->db->join('users as authorUser', 'authorUser.user_id = forum_answers.author_id');
        $this->db->group_by('forum_answers.answer_id');        
        return $this->db->get()->result();
    }

    public function get_flagged_comments($where='')
    {


        $this->db->select('forum_answer_comments.*, authorUser.first_name as author_first_name, authorUser.last_name as author_last_name, authorUser.username as author_username, authorUser.user_id as author_id, reporterUser.first_name as reporter_first_name, reporterUser.last_name as reporter_last_name, reporterUser.username as reporter_username, forum_comments_user_flagged.user_id as reporter_id, forum_answers.subject as answer, forum_questions.title as question, forum_questions.slug, forum_questions.question_id');
        $this->db->from('forum_answer_comments');
        $this->db->join('forum_answers', 'forum_answers.answer_id = forum_answer_comments.answer_id');
        $this->db->join('forum_comments_user_flagged', 'forum_comments_user_flagged.comment_id = forum_answer_comments.comment_id');
        $this->db->join('users as authorUser', 'authorUser.user_id = forum_answer_comments.user_id');
        $this->db->join('users as reporterUser', 'reporterUser.user_id = forum_comments_user_flagged.user_id');
        $this->db->join('forum_questions', 'forum_questions.question_id = forum_answers.question_id');
        $this->db->group_by( 'forum_answer_comments.comment_id' );
        return $this->db->get()->result();
    }

    public function get_user_register_data() {

        $this->db->select('count(users.user_id) as count, users.created');
        $this->db->from('users');
        $this->db->group_by('DATE(users.created)');
        return $this->db->get()->result();
    }
}