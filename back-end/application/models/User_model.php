<?php 

class User_model extends CI_Model {

    public function get_user_info($where) {

      $this->db->select("users.first_name, users.last_name, users.profile_pic, users.user_email, users.points, users.badge, users.user_type, users.username, users.cover_pic, 
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

    public function get_user_points($user_id) {

      $this->db->select("points_allocation.*, stories.slug, answer_ka_question.slug as answer_slug, question.slug as question_slug");
      $this->db->from('points_allocation');
      // join for story as selector
      $this->db->join('stories', "points_allocation.selector_id = stories.story_id AND points_allocation.selector = 'story'", 'left');

      // joins for answer as selector
      $this->db->join('forum_answers', "points_allocation.selector_id = forum_answers.answer_id AND points_allocation.selector = 'answer'", 'left');
      $this->db->join('forum_questions as answer_ka_question', "answer_ka_question.question_id = forum_answers.question_id", 'left');

      // join for question as selector
      $this->db->join('forum_questions as question', "points_allocation.selector_id = question.question_id AND points_allocation.selector = 'question'", 'left');

      $this->db->where( array("points_allocation.user_id" => $user_id) );
      $this->db->group_by( 'points_allocation.point_id' );
      $this->db->order_by( 'points_allocation.created', 'DESC' );
      return $this->db->get()->result();
    }

    public function get_user_questions_list($where, $limit, $offset) {

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
        if ( $offset != '' && $limit != '' ) {
          
          $this->db->limit($limit, $offset);
        }
        $this->db->order_by('forum_questions.created', 'DESC');
        return $this->db->get()->result();
    }

    public function get_user_answers_list($where, $limit, $offset) {

        $this->db->select('forum_questions.*, 
          users.first_name, users.last_name, users.username, users.profile_pic, 
          forum_answers.created as answered_at, forum_answers.subject as answer, 
          forum_answers.views, forum_answers.answer_id, 
          count(distinct forum_answer_user_likes.user_id) as likes,
          count(distinct current_user_like.user_id) as user_liked,
          GROUP_CONCAT(distinct topics.name ORDER BY topics.topic_id) as topics, 
          GROUP_CONCAT(distinct topics.topic_id ORDER BY topics.topic_id) as topic_ids');
        $this->db->from('forum_questions');
        // get top answer
        $this->db->join('forum_answers', 'forum_answers.question_id = forum_questions.question_id', 'left');
        // get topics tagged with question
        $this->db->join('thread_topics', 'thread_topics.thread_id = forum_questions.question_id', 'left');
        // get names of topics
        $this->db->join('topics', 'topics.topic_id = thread_topics.topic_id', 'left');
        // get number of likes on answer
        $this->db->join('forum_answer_user_likes', 'forum_answer_user_likes.answer_id = forum_answers.answer_id', 'left');
        // check if user liked an answer
        $this->db->join('forum_answer_user_likes as current_user_like', 'current_user_like.answer_id = forum_answers.answer_id AND current_user_like.user_id = '.$where['forum_answers.author_id'], 'left');
        // get answer author information
        $this->db->join('users', 'users.user_id = forum_answers.author_id', 'left');
        $this->db->where( $where );
        $this->db->group_by('forum_questions.question_id');
        if ( $offset != '' && $limit != '' ) {
          
          $this->db->limit($limit, $offset);
        }

        return $this->db->get()->result();
      }

    public function get_user_story_details($story_id) {
        

        $this->db->select('stories.title, stories.preview_title, stories.preview_subtitle, stories.created, stories.story_id, stories.slug, stories.author_id, stories.featured, users.first_name, users.last_name, users.username, count(distinct story_user_views.user_id) as total_views, count(distinct story_user_likes.user_id) as total_likes, count(distinct comments.comment_id) as total_comments');
        $this->db->from('stories');
        $this->db->join('users', 'users.user_id = stories.author_id');
        $this->db->join('story_user_views', 'story_user_views.story_id = stories.story_id', 'left');
        $this->db->join('story_user_likes', 'story_user_likes.story_id = stories.story_id', 'left');
        $this->db->join('comments', 'comments.story_id = stories.story_id AND comments.approved = 1', 'left');
        $this->db->where( array('stories.story_id' => $story_id) );
        return $this->db->get()->result();
    }

    public function get_story_views($story_id) {
        
        $this->db->select('story_user_views.*, users.first_name, users.last_name, users.username');
        $this->db->from('story_user_views');
        $this->db->join('users', 'users.user_id = story_user_views.user_id');
        $this->db->where( array('story_user_views.story_id' => $story_id) );
        return $this->db->get()->result();
    }

}