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

    public function data_exists($table, $where="")
    {
        if ( $where == "" ) {
            
          return $this->db->get_where( $table )->num_rows();
        } else {

    		  return $this->db->get_where( $table, $where )->num_rows();
        }
    }

    public function get_users()
    {

        $this->db->select('users.user_id, users.first_name, users.last_name, users.profile_pic, users.user_email, users.user_type, users.username, users.created, status.name as status');
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

    public function get_searched_tags($where='', $filter_value='')
    {

        $this->db->select('*');
        $this->db->from('tags');
        if ( $where != '' ) {
          
          $this->db->where($where);
        }

        if ( $filter_value != '' ) {
          
          $this->db->like('name', $filter_value, 'after');     // Produces: WHERE `name` LIKE 'filter_value%' ESCAPE '!'
        }

        return $this->db->get()->result();
    }

    public function get_searched_topics($where='', $filter_value='')
    {

        $this->db->select('*');
        $this->db->from('topics');
        if ( $where != '' ) {
          
          $this->db->where($where);
        }

        if ( $filter_value != '' ) {
          
          $this->db->like('name', $filter_value, 'after');     // Produces: WHERE `name` LIKE 'filter_value%' ESCAPE '!'
        }

        return $this->db->get()->result();
    }


    public function get_searched_authors($where='', $filter_value='')
    {

        $this->db->select('users.first_name, users.last_name, users.username, users.user_id as author_id');
        $this->db->from('users');
        if ( $where != '' ) {
          
          $this->db->where($where);
        }

        if ( $filter_value != '' ) {
          
          $this->db->like('first_name', $filter_value, 'after');
          $this->db->or_like('last_name', $filter_value, 'after');
          $this->db->or_like('username', $filter_value, 'after');
        }

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

    public function get_story_author($story_id)
    {
        
        $this->db->select('stories.author_id');
        $this->db->from('stories');
        $this->db->where( array('stories.story_id' => $story_id) );
        return $this->db->get()->row();
    }

    public function update_user_points($user_id, $points)
    {
      $this->db->where('user_id', $user_id);
      $this->db->set('points', 'points+'.$points, FALSE);
      $this->db->update('users');

      $this->db->select('users.points');
      $this->db->from('users');
      $this->db->where('user_id', $user_id);
      $user_points = $this->db->get()->row();

      if ( $user_points->points > 0 && $user_points->points <= 100 ) {
        
        $badge =  "Beginner";
      } else if ( $user_points->points > 100 && $user_points->points <= 500 ) {
        
        $badge =  "Apprentice";
      } else if ( $user_points->points > 500 && $user_points->points <= 1000 ) {
        
        $badge =  "Enthusiast";
      } else if ( $user_points->points > 1000 && $user_points->points <= 2000 ) {
        
        $badge =  "Intermediate";
      } else if ( $user_points->points > 2000 && $user_points->points <= 5000 ) {
        
        $badge =  "Pro";
      } else if ( $user_points->points > 5000 ) {
        
        $badge =  "Master";
      }

      $this->update_entry('users', 
        array('badge' => $badge), 
        array('user_id' => $user_id)
      );

      return $user_points;
    }

    public function get_stories($where='', $limit='', $offset='', $order='', $like='', $user_id=0) {
        

        $this->db->select('stories.preview_title, stories.preview_subtitle, stories.preview_image, stories.slug, stories.created, stories.story_id, stories.author_id, stories.type, users.first_name, users.last_name, users.username, count(distinct story_user_likes.user_id) as likes, count(distinct user_liked.story_id) as liked');
        $this->db->from('stories');
        $this->db->join('users', 'users.user_id = stories.author_id');
        $this->db->join('story_tags', 'story_tags.story_id = stories.story_id', 'left');
        $this->db->join('story_user_likes', 'story_user_likes.story_id = stories.story_id', 'left');
        $this->db->join('story_user_likes as user_liked', 'user_liked.story_id = stories.story_id AND user_liked.user_id = '.$user_id, 'left');
        $this->db->where( $where );
        $this->db->group_by( 'stories.story_id' );

        if ( $offset != '' && $limit != '' ) {
          
          $this->db->limit($limit, $offset);
        }

        if ( $like != '' ) {
          
          $this->db->like($like);
        }
        
        if ( $order == 'random' ) {
          
          $this->db->order_by('stories.preview_title', 'RANDOM');
        }

        return $this->db->get()->result();
    }

    public function get_story_data($where='', $user_id='') {
        
        if ( $user_id == '' ) {
          
          $this->db->select("stories.*, users.first_name, users.last_name, users.username, users.profile_pic,
            max(case when usermeta.meta_key='professional_info' then usermeta.meta_value end) as professional_info");
          $this->db->from('stories');
          $this->db->join('users', 'users.user_id = stories.author_id');
          $this->db->join('usermeta', 'usermeta.user_id = stories.author_id', 'left');
          $this->db->where( $where );
          $this->db->group_by( 'stories.story_id' );
          return $this->db->get()->result();
        } else {

          $this->db->select("stories.*, users.first_name, users.last_name, users.username, story_user_likes.user_id as liked_by, users.profile_pic,
            max(case when usermeta.meta_key='professional_info' then usermeta.meta_value end) as professional_info");
          $this->db->from('stories');
            
          $this->db->join('users', 'users.user_id = stories.author_id');
          $this->db->join('usermeta', 'usermeta.user_id = stories.author_id', 'left');
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

    public function get_answer_comments($parent, $answer_id)
    {
      $this->db->select('forum_answer_comments.*, users.first_name, users.last_name, users.username, users.username, users.profile_pic, users.user_type');
      $this->db->from('forum_answer_comments');
      $this->db->join('users', 'users.user_id = forum_answer_comments.user_id');
      $this->db->where( array('forum_answer_comments.parent' => $parent, 'forum_answer_comments.answer_id' => $answer_id,'forum_answer_comments.approved' => 1) );
      $comments = $this->db->get()->result();

      return $comments;
    }

    public function get_answer_comments_for_user($parent, $answer_id, $user_id)
    {
      $this->db->select('forum_answer_comments.*, users.first_name, users.last_name, users.username, users.username, users.profile_pic, users.user_type');
      $this->db->from('forum_answer_comments');
      $this->db->join('users', 'users.user_id = forum_answer_comments.user_id');
      $this->db->where( "`forum_answer_comments.parent` = ".$parent." AND `forum_answer_comments.answer_id` = ".$answer_id." AND (`forum_answer_comments`.`approved` = 1 OR `forum_answer_comments`.`user_id` = ".$user_id." )" );
      $comments = $this->db->get()->result();

      return $comments;
    }
    
    public function get_comment_by_id($comment_id)
    {
      $this->db->select('comments.*, users.first_name, users.last_name, users.username, users.profile_pic, users.user_type');
      $this->db->from('comments');
      $this->db->join('users', 'users.user_id = comments.user_id');
      $this->db->where( array('comments.comment_id' => $comment_id) );
      $comments = $this->db->get()->row();

      return $comments;
    }

    public function get_answer_comment_by_id($comment_id)
    {
      $this->db->select('forum_answer_comments.*, users.first_name, users.last_name, users.username, users.profile_pic, users.user_type');
      $this->db->from('forum_answer_comments');
      $this->db->join('users', 'users.user_id = forum_answer_comments.user_id');
      $this->db->where( array('forum_answer_comments.comment_id' => $comment_id) );
      $comments = $this->db->get()->row();

      return $comments;
    }

    public function get_tags($where='', $like='')
    {
         
        $this->db->select('tags.*, count(story_tags.story_id) as stories, users.first_name, users.last_name, users.username');
        $this->db->from('tags');
        $this->db->join('story_tags', 'story_tags.tag_id = tags.tag_id', 'left');
        $this->db->join('users', 'users.user_id = tags.created_by', 'left');
        $this->db->group_by('tags.tag_id');
        $this->db->order_by('stories', 'desc');
        return $this->db->get()->result();
    }

    public function get_topics($where='', $like='')
    {
         
        $this->db->select('topics.*, count(thread_topics.thread_id) as questions, users.first_name, users.last_name, users.username');
        $this->db->from('topics');
        $this->db->join('thread_topics', 'thread_topics.topic_id = topics.topic_id', 'left');
        $this->db->join('users', 'users.user_id = topics.created_by', 'left');
        $this->db->group_by('topics.topic_id');
        $this->db->order_by('questions', 'desc');
        return $this->db->get()->result();
    }

    public function get_question_data($where, $user_id="")
    {

      if ( $user_id=="" ) {
        
        $this->db->select('forum_questions.*, 
          GROUP_CONCAT(distinct topics.name ORDER BY topics.topic_id) as topics, 
          GROUP_CONCAT(distinct topics.topic_id ORDER BY topics.topic_id) as topic_ids');
        $this->db->from('forum_questions');        
        // get topics tagged with question
        $this->db->join('thread_topics', 'thread_topics.thread_id = forum_questions.question_id', 'left');
        // get names of topics
        $this->db->join('topics', 'topics.topic_id = thread_topics.topic_id', 'left');        
        $this->db->where($where);
        $this->db->group_by('forum_questions.question_id');
        return $this->db->get()->result();
      } else {

        $this->db->select('forum_questions.*, 
          GROUP_CONCAT(distinct topics.name ORDER BY topics.topic_id) as topics, 
          GROUP_CONCAT(distinct topics.topic_id ORDER BY topics.topic_id) as topic_ids,
          count(distinct forum_answers.author_id) as hasAnswered');
        $this->db->from('forum_questions');
        // get topics tagged with question
        $this->db->join('thread_topics', 'thread_topics.thread_id = forum_questions.question_id', 'left');
        // get names of topics
        $this->db->join('topics', 'topics.topic_id = thread_topics.topic_id', 'left');        
        // get answer by loggedin user
        $this->db->join('forum_answers', 'forum_answers.question_id = forum_questions.question_id AND forum_answers.author_id = '.$user_id, 'left');
        $this->db->where($where);
        $this->db->group_by('forum_questions.question_id');
        return $this->db->get()->result();
      }

        // return $this->get_data('forum_questions', $where);
    }
    
    public function get_questions_list($where="", $user_id="", $limit="", $offset="", $like="", $having="")
    {

      if ( $user_id == "" ) {
        
        $this->db->select('forum_questions.*, 
          users.first_name, users.last_name, users.username, users.profile_pic, 
          forum_answers.created as answered_at, forum_answers.subject as answer, 
          forum_answers.views, forum_answers.answer_id, 
          count(distinct forum_answer_user_likes.user_id) as likes,          
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
        // get answer author information
        $this->db->join('users', 'users.user_id = forum_answers.author_id', 'left');
        $this->db->where( $where );
        $this->db->group_by('forum_questions.question_id');
        if ( $offset != '' && $limit != '' ) {
          
          $this->db->limit($limit, $offset);
        }


        if ( $like != '' ) {
          
          $this->db->like($like);
        }

        if ( $having != '' ) {
          
          $this->db->having('find_in_set("'.$having.'", topic_ids) <> 0');
        }

        return $this->db->get()->result();
      } else {

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
        $this->db->join('forum_answer_user_likes as current_user_like', 'current_user_like.answer_id = forum_answers.answer_id AND current_user_like.user_id = '.$user_id, 'left');
        // get answer author information
        $this->db->join('users', 'users.user_id = forum_answers.author_id', 'left');
        $this->db->where( $where );
        $this->db->group_by('forum_questions.question_id');
        if ( $offset != '' && $limit != '' ) {
          
          $this->db->limit($limit, $offset);
        }

        if ( $like != '' ) {
          
          $this->db->like($like);
        }

        if ( $having != '' ) {
          
          $this->db->having('find_in_set("'.$having.'", topic_ids) <> 0');
        }

        return $this->db->get()->result();
      }

    }

    public function get_answers($where="", $user_id="")
    {

      if ( $user_id == "" ) {
        
        $this->db->select('forum_answers.*, 
          users.first_name, users.last_name, users.username, users.profile_pic,
          count(distinct forum_answer_user_likes.user_id) as likes,
          count(distinct forum_answer_comments.comment_id) as comments_count');
        $this->db->from('forum_answers');
        // get number of likes on answer
        $this->db->join('forum_answer_user_likes', 'forum_answer_user_likes.answer_id = forum_answers.answer_id', 'left');
        // get number of comments
        $this->db->join('forum_answer_comments', 
          'forum_answer_comments.answer_id = forum_answers.answer_id AND 
          forum_answer_comments.approved = 1
          ', 'left');        
        // get answer author information      
        $this->db->join('users', 'users.user_id = forum_answers.author_id', 'left');
        $this->db->where($where);
        $this->db->group_by('forum_answers.answer_id');
        $this->db->order_by('likes', 'DESC');
        return $this->db->get()->result();
      } else {

        // do not show answer by logged in user
        // (get_answer_by_user) this function should be used to fetch answer by logged in user
        $where['forum_answers.author_id !='] = $user_id;

        $this->db->select('forum_answers.*, 
          users.first_name, users.last_name, users.username, users.profile_pic,
          count(distinct forum_answer_user_likes.user_id) as likes,
          count(distinct current_user_like.user_id) as user_liked,
          count(distinct forum_answer_comments.comment_id) as comments_count');
        $this->db->from('forum_answers');
        // get number of likes on answer
        $this->db->join('forum_answer_user_likes', 'forum_answer_user_likes.answer_id = forum_answers.answer_id', 'left');
        // check if user liked an answer
        $this->db->join('forum_answer_user_likes as current_user_like', 'current_user_like.answer_id = forum_answers.answer_id AND current_user_like.user_id = '.$user_id, 'left');
        // get number of comments
        $this->db->join('forum_answer_comments', '(forum_answer_comments.answer_id = forum_answers.answer_id AND forum_answer_comments.approved = 1) OR 
          (forum_answer_comments.answer_id = forum_answers.answer_id AND forum_answer_comments.user_id = '.$user_id.')', 'left');
        // get answer author information      
        $this->db->join('users', 'users.user_id = forum_answers.author_id', 'left');
        $this->db->where($where);
        $this->db->group_by('forum_answers.answer_id');
        $this->db->order_by('likes', 'DESC');
        return $this->db->get()->result();
      }
    }

    public function get_answer_by_user($where="", $user_id="")
    {

        $this->db->select('forum_answers.*, 
          users.first_name, users.last_name, users.username, users.profile_pic,
          count(distinct forum_answer_user_likes.user_id) as likes,
          count(distinct current_user_like.user_id) as user_liked,
          count(distinct forum_answer_comments.comment_id) as comments_count');
        $this->db->from('forum_answers');
        // get number of likes on answer
        $this->db->join('forum_answer_user_likes', 'forum_answer_user_likes.answer_id = forum_answers.answer_id', 'left');
        // check if user liked an answer
        $this->db->join('forum_answer_user_likes as current_user_like', 'current_user_like.answer_id = forum_answers.answer_id AND current_user_like.user_id = '.$user_id, 'left');
        // get number of comments
        $this->db->join('forum_answer_comments', '(forum_answer_comments.answer_id = forum_answers.answer_id AND forum_answer_comments.approved = 1) OR 
          (forum_answer_comments.answer_id = forum_answers.answer_id AND forum_answer_comments.user_id = '.$user_id.')', 'left');
        // get answer author information      
        $this->db->join('users', 'users.user_id = forum_answers.author_id', 'left');
        $this->db->where($where);
        $this->db->group_by('forum_answers.answer_id');
        $this->db->order_by('likes', 'DESC');
        return $this->db->get()->result();      
    }

    public function get_sidebar_topics()
    {
      $this->db->select('topics.*, count(forum_questions.question_id) as questions');
      $this->db->from('topics');
      $this->db->join('thread_topics', 'thread_topics.topic_id = topics.topic_id', 'left');
      $this->db->join('forum_questions', 'forum_questions.question_id = thread_topics.thread_id');
      $this->db->where( array('topics.icon_class !=' => "") );
      $this->db->group_by('topics.topic_id');
      $this->db->limit(12);
      $this->db->order_by('questions', 'DESC');
      return $this->db->get()->result();
    }


}