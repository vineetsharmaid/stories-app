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

}