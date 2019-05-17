<?php
require_once APPPATH . '/libraries/JWT.php';
require_once APPPATH . '/libraries/BeforeValidException.php';
require_once APPPATH . '/libraries/ExpiredException.php';
require_once APPPATH . '/libraries/SignatureInvalidException.php';

use Restserver\Libraries\REST_Controller;
use \Firebase\JWT\JWT;
defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
//To Solve File REST_Controller not found
require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';

/**
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array
 *
 * @package         CodeIgniter
 * @subpackage      Rest Server
 * @category        Controller
 * @author          Phil Sturgeon, Chris Kacerguis
 * @license         MIT
 * @link            https://github.com/chriskacerguis/codeigniter-restserver
 */
class Users extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        $this->methods['get_users_get']['limit'] = 500; // 500 requests per hour per user/key
        $this->methods['users_post']['limit'] = 100; // 100 requests per hour per user/key
        $this->methods['users_delete']['limit'] = 50; // 50 requests per hour per user/key

        $this->load->model('user_model');

        if ( is_null($this->input->get_request_header('Authorization')) ) {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'auth_error',
                'error' => array('Invalid token provided.'),
            ], 401);
        } else {


          $authorization = $this->input->get_request_header('Authorization');
          
          $token    = $this->getBearerToken($authorization);
          $jwt_key  = $this->config->item('thekey');

          try {
             
             $this->token_data = JWT::decode($token, $jwt_key, array('HS256'));

          } catch (Exception $e) {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'auth_error',
                'error' => array($e->getMessage()),
            ], 401);
          }

        }       
    }

    // extend token expiration time
    public function verify_token_get()
    {
      $this->token_data->exp += 60*30; // 30 minutes
      
      $jwt_key = $this->config->item('thekey');

      //This is the output token
      $token = JWT::encode($this->token_data,$jwt_key );

      // Set the response and exit
      $this->response([
          'status' => TRUE,
          'data' => array('token' => $token),
          'message' => 'token_verified',
      ], REST_Controller::HTTP_OK); // NOT_FOUND (404) being the HTTP response code
    }


    function save_story_post()
    {

      // convert json post data to array
      $post_data = json_decode(file_get_contents("php://input"));

      $user = $this->common_model->get_data('users', array('username' => $this->token_data->username));
      $title  = trim( strip_tags($post_data->title) );
      $slug   = strtolower( str_replace(' ', '-', $title) );
      
      $description = $post_data->description;
      
      // remove froala text
      if(strpos($description, '<p data-f-id="pbf"')) {
  
        $description = substr($description, 0, strpos($description, '<p data-f-id="pbf"'));
      }

      $story = array(
        'title'  => trim( strip_tags($post_data->title) ),
        'slug'   => $slug,
        'status' => 0,
        'author_id' => $user[0]->user_id,
        'description' => htmlEntities($description, ENT_QUOTES),
      );
      
      // html_entity_decode($encodedHTML)

      if( $this->common_model->insert_entry('stories', $story) ) {

            $story_id = $this->db->insert_id();

            // Set the response and exit
            $this->response([
                'status' => TRUE,
                'data' => array('story' => $story_id),
                'message' => 'story_saved',
            ], REST_Controller::HTTP_OK); // NOT_FOUND (404) being the HTTP response code
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'database_error',
                'error' => array('Something went wrong, unable to save story.'),
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR); // NOT_FOUND (404) being the HTTP response code
      }
    }


    function save_answer_post() {
      
      $subject = $this->input->post('subject');
      
      // remove froala text
      if(strpos($subject, '<p data-f-id="pbf"')) {
  
        $subject = substr($subject, 0, strpos($subject, '<p data-f-id="pbf"'));
      }

      $answer = array(
        'status' => 0,
        'author_id' => $this->token_data->id,
        'question_id' => $this->input->post('question_id'),
        'subject'  => htmlEntities($subject, ENT_QUOTES),
      );
      
      // html_entity_decode($encodedHTML)

      if( $this->common_model->insert_entry('forum_answers', $answer) ) {

            $answer_id = $this->db->insert_id();

            $answers = $this->common_model->get_answer_by_user( 
              array( 
                'forum_answers.question_id' => $this->input->post('question_id'),
                'forum_answers.answer_id' => $answer_id
              ), 
              $this->token_data->id 
            );

            // echo $this->db->last_query();

            if ( !empty($answers) ) {

              foreach ($answers as $answer) {
                
                $answer->answer    = is_null($answer->subject) ? null : html_entity_decode($answer->subject);

                // get in time ago format
                $answer->answered_ago = $this->time_elapsed_string($answer->created);
              }
            }

            // Set the response and exit
            $this->response([
                'status' => TRUE,
                'data' => array( 'answer' => $answers, 'slug' => $this->input->post('slug'),  ),
                'message' => 'answer_saved',
            ], REST_Controller::HTTP_OK); // NOT_FOUND (404) being the HTTP response code
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'database_error',
                'error' => array('Something went wrong, unable to save answer.'),
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR); // NOT_FOUND (404) being the HTTP response code
      }
    }


    function update_answer_post() {

      $subject = $this->input->post('subject');
      
      // remove froala text
      if(strpos($subject, '<p data-f-id="pbf"')) {
  
        $subject = substr($subject, 0, strpos($subject, '<p data-f-id="pbf"'));
      }

      $answer = array(        
        'subject'  => htmlEntities($subject, ENT_QUOTES),
      );
      
      $where = array('answer_id' => $this->input->post('answer_id'));

      // get anwer to verify author
      $check_answer = $this->common_model->get_data( 'forum_answers', $where );

      // verify author is logged in user
      if ( $check_answer[0]->author_id ==  $this->token_data->id) {
        // update if author has acess to edit
        if( $this->common_model->update_entry('forum_answers', $answer, $where) ) {

              // Set the response and exit
              $this->response([
                  'status' => TRUE,
                  'data' => array( 'answer' => $answer ),
                  'message' => 'answer_saved',
              ], REST_Controller::HTTP_OK); // NOT_FOUND (404) being the HTTP response code
        } else {

              // Set the response and exit
              $this->response([
                  'status' => FALSE,
                  'message' => 'database_error',
                  'error' => array('Something went wrong, unable to update answer.'),
              ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR); // NOT_FOUND (404) being the HTTP response code
        }
      } else {

        // Set the response and exit
        $this->response([
            'status' => FALSE,
            'message' => 'not_authorized',
            'error' => array('Something went wrong, unable to update answer.'),
        ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR); // NOT_FOUND (404) being the HTTP response code
      }
    }

    public function get_answer_by_user_get($question_id) {


      $answers = $this->common_model->get_answer_by_user( 
        array( 
          'forum_answers.question_id' => $question_id, 
          'forum_answers.author_id'   => $this->token_data->id
        ), $this->token_data->id );
      
      if ( !empty($answers) ) {


        foreach ($answers as $answer) {
          
          $answer->answer    = is_null($answer->subject) ? null : html_entity_decode($answer->subject);

          if ( isset($this->token_data->id) && $answer->author_id == $this->token_data->id ) {
            
            $answer->isEditable = true;
          }

          // get in time ago format
          $answer->answered_ago = $this->time_elapsed_string($answer->created);
        }

        // Set the response and exit
        $this->response(
          array(
            'status' => TRUE,
            'data' => $answers[0],
          ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
      } else {

        // Set the response and exit
        $this->response([
            'status' => FALSE,
            'message' => 'No answers were found'
        ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }    

    public function change_like_status_post() {
        
        $data = array('answer_id' => $this->input->post('answer_id'), 'user_id' => $this->token_data->id);

        if ($this->common_model->data_exists('forum_answer_user_likes', $data) == 0) {
          if ( $this->common_model->insert_entry('forum_answer_user_likes', $data) ) {

              // Set the response and exit
              $this->response(  
                array(
                  'status' => TRUE,
                  'data'   => 'Liked the answer',
                ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
          } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'Unable to update in db',
                'error' => array('Unable to update in db'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code            
          }
        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'Already liked by this user',
                'error' => array('Already liked by this user'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
      
    }



    public function add_story_comment_post()
    {
      
      $comment = array(
        'content'   => $this->input->post('comment'),
        'story_id'  => $this->input->post('story_id'),
        'parent'    => $this->input->post('parent'),
        'user_id'   => $this->token_data->id,
        'approved'  => COMMENT_STATUS_PUBLISHED,
      );

      if( $this->common_model->insert_entry('comments', $comment) ) {
            
          $comment_data = $this->common_model->get_comment_by_id( $this->db->insert_id() );

          $comment_data->created = $this->time_elapsed_string($comment_data->created);

          // Set the response and exit
          $this->response(  
            array( 'status' => TRUE, 'data' => $comment_data,'message' => 'comment added to story', ), 
            REST_Controller::HTTP_OK
          ); // OK (200) being the HTTP response code
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'Unable to add comment',
              'error' => array('Unable to add comment'),
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }

    public function add_answer_comment_post()
    {
      
      $comment = array(
        'content'   => $this->input->post('content'),
        'answer_id'  => $this->input->post('answer_id'),
        'parent'    => $this->input->post('parent'),
        'user_id'   => $this->token_data->id,
        'approved'  => COMMENT_STATUS_PUBLISHED,
      );

      if( $this->common_model->insert_entry('forum_answer_comments', $comment) ) {
            
          $comment_data = $this->common_model->get_answer_comment_by_id( $this->db->insert_id() );

          $comment_data->created = $this->time_elapsed_string($comment_data->created);
          
          // Set the response and exit
          $this->response(  
            array( 'status' => TRUE, 'data' => $comment_data,'message' => 'comment added to story', ), 
            REST_Controller::HTTP_OK
          ); // OK (200) being the HTTP response code
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'Unable to add comment',
              'error' => array('Unable to add comment'),
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }

    function update_story_post()
    {

      // convert json post data to array
      $post_data = json_decode(file_get_contents("php://input"));

      $user = $this->common_model->get_data('users', array('username' => $this->token_data->username));

      $title  = trim( strip_tags($post_data->title) );
      // $slug   = strtolower( str_replace(' ', '-', $title) );
      $description = $post_data->description;
      
      // remove froala text
      if(strpos($description, '<p data-f-id="pbf"')) {
  
        $description = substr($description, 0, strpos($description, '<p data-f-id="pbf"'));
      }

      $story = array(
        'title' => trim( strip_tags($post_data->title) ),
        // 'slug'   => $slug,
        'description' => htmlEntities($description, ENT_QUOTES),
        'author_id' => $user[0]->user_id,
        'status' => 0
      );
      
      $where = array('story_id' => $post_data->story_id);

      if( $this->common_model->update_entry('stories', $story, $where) ) {

            // Set the response and exit
            $this->response([
                'status' => TRUE,
                'data' => array('story' => $post_data),
                'message' => 'story_saved',
            ], REST_Controller::HTTP_OK); // NOT_FOUND (404) being the HTTP response code
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'database_error',
                'error' => array('Something went wrong, unable to save story.'),
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR); // NOT_FOUND (404) being the HTTP response code
      }
    }

    function delete_story_get($story_id)
    {
      // before delete check whether user is the author of the story and story is in draft
      $where = array('status' => STORY_STATUS_DRAFT, 'author_id' => $this->token_data->id, 'story_id' => $story_id );
      if( $this->common_model->data_exists('stories', $where) > 0 ) {

        $this->common_model->delete_entry('stories', array('story_id' => $story_id));

        // Set the response and exit
        $this->response([
            'status' => TRUE,
            'data' => array('story_id' => $story_id),
            'message' => 'story_deleted',
        ], REST_Controller::HTTP_OK); // NOT_FOUND (404) being the HTTP response code
      } else {

        // Set the response and exit
        $this->response([
            'status' => FALSE,
            'message' => 'authentication_error',
            'error' => array('You do no have access to delete this story.'),
        ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR); // NOT_FOUND (404) being the HTTP response code
      }

    }

    function submit_story_for_review_post()
    {

      // convert json post data to array
      $post_data = json_decode(file_get_contents("php://input"));

      $user = $this->common_model->get_data('users', array('username' => $post_data->username));
      $company_id = isset($post_data->company_id) ? $post_data->company_id : 0;
      $have_company = isset($post_data->have_company) ? $post_data->have_company : 0;
      $country = isset($post_data->country) ? $post_data->country : "";

      $story = array(
        'preview_title' => trim( strip_tags($post_data->previewTitle) ),
        'preview_subtitle' => trim( strip_tags($post_data->previewSubtitle) ),
        'author_id'    => $user[0]->user_id,
        'company_id'   => $company_id,
        'have_company' => $have_company,
        'country'     => $country,
        'type'   => $post_data->type,
        'status' => 0,
        'review' => 2, // submitted for review
      );
      
      // html_entity_decode($encodedHTML)

      if( $this->common_model->update_entry('stories', $story, array('story_id' => $post_data->story)) ) {

            // Set the response and exit
            $this->response([
                'status' => TRUE,
                'message' => 'story_saved',
            ], REST_Controller::HTTP_OK); // NOT_FOUND (404) being the HTTP response code
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'database_error',
                'error' => array('Something went wrong, unable to save story.'),
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR); // NOT_FOUND (404) being the HTTP response code
      }
    }


    function save_preview_post()
    {

      // convert json post data to array
      $post_data = json_decode(file_get_contents("php://input"));

      $user = $this->common_model->get_data('users', array('username' => $post_data->username));
      
      $story = array(
        'preview_title' => trim( strip_tags($post_data->previewTitle) ),
        'preview_subtitle' => trim( strip_tags($post_data->previewSubtitle) ),
        'author_id' => $user[0]->user_id,
      );

      if( $this->common_model->update_entry('stories', $story, array('story_id' => $post_data->story)) ) {

            // Set the response and exit
            $this->response([
                'status' => TRUE,
                'message' => 'story_saved',
            ], REST_Controller::HTTP_OK); // NOT_FOUND (404) being the HTTP response code
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'database_error',
                'error' => array('Something went wrong, unable to save story.'),
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR); // NOT_FOUND (404) being the HTTP response code
      }
    }


    function add_question_post()
    {

      $title= $this->input->post('title');


      $slug   = $this->slugify($title).'-'.strtotime(date('Y-m-d h:i:s'));
      // strtolower( str_replace(array(' ', '?'), '-', $title) ).''.strtotime(date('Y-m-d h:i:s'));

      $question = array(
        'author_id' => $this->token_data->id,
        'title' => trim( strip_tags($title) ),
        'slug' => $slug,
      );
      
      $topic_ids = explode(',', $this->input->post('topics'));
      
      if( $this->common_model->insert_entry('forum_questions', $question) ) {

            $question['question_id'] = $this->db->insert_id();

            if ( !empty($topic_ids) ) {
              foreach ($topic_ids as $topic_id) {
                
                $this->common_model->insert_entry(
                      'thread_topics', 
                      array('thread_id' => $question['question_id'], 'topic_id' => $topic_id)
                    );
              }
            }

            // Set the response and exit
            $this->response([
                'status' => TRUE,
                'data' => $question,
                'message' => 'question_added',
            ], REST_Controller::HTTP_OK); // NOT_FOUND (404) being the HTTP response code
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'database_error',
                'error' => array('Something went wrong, unable to add question.'),
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR); // NOT_FOUND (404) being the HTTP response code
      }
    }

    public function get_user_questions_list_get($limit, $offset)
    {
      
      $questions = $this->user_model->get_user_questions_list( array('users.user_id' => $this->token_data->id), $limit, $offset );

      if ( !empty($questions) ) {
          
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => $questions,
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code        
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No questions were found',
                'error' => array('No questions were found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }

    public function get_user_answers_list_get($limit, $offset)
    {
      
      $answers = $this->user_model->get_user_answers_list( array('forum_answers.author_id' => $this->token_data->id), $limit, $offset );

      if ( !empty($answers) ) {


          foreach ($answers as $answer) {
            
            $answer->answer    = is_null($answer->answer) ? null : html_entity_decode($answer->answer);
            $answer->topics    = is_null($answer->topics) ? [] : explode(',', $answer->topics);
            $answer->topic_ids = is_null($answer->topic_ids) ? [] : explode(',', $answer->topic_ids);
            
            // get in time ago format
            $answer->answered_ago = $this->time_elapsed_string($answer->answered_at);

            $answer->tempAnswer = ""; // for frontend purpose
            $answer->showAnswerBox = false; // for frontend purpose
          }
          
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => $answers,
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code        
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No user were found',
                'error' => array('No user were found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }

    public function image_upload_post() { 
      
      $config['upload_path']          = './assets/uploads/stories/';
      $config['allowed_types']        = 'gif|jpg|png|jpeg';
      $config['max_size']             = 2048;
      // $config['max_width']            = 1024;
      // $config['max_height']           = 768;

      $this->load->library('upload', $config);

      if ( ! $this->upload->do_upload('image'))
      {
          $error = array('error' => $this->upload->display_errors());

          // Set the response and exit
          $this->response([
              'status'  => FALSE,
              'message' => 'not_uploaded',
              'error'   => $error,
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
      else
      {
          $data = array('upload_data' => $this->upload->data());

          $upload_data = $data['upload_data'];

          $upload_data['raw_name'].$upload_data['file_ext'];
          
          $story = array(
            'preview_image' => $upload_data['raw_name'].$upload_data['file_ext'],
          );
          
          $where = array('story_id' => $this->input->post('story_id'));

          if( $this->common_model->update_entry('stories', $story, $where) ) {


            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data' => 'image_uploaded_updated',
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
          } else {

            // Set the response and exit
            $this->response([
                'status'  => FALSE,
                'message' => 'not_updated_db_error',
                'error'   => 'Something went wrong, unable to update preview image.',
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code            
          }          
      }

    }

    public function user_image_upload_post() { 
      
      $config['upload_path']          = './assets/uploads/users/';
      $config['allowed_types']        = 'gif|jpg|png|jpeg';
      $config['max_size']             = 2048*5;
      // $config['max_width']            = 1024;
      // $config['max_height']           = 768;

      $this->load->library('upload', $config);
      $this->load->library('image_lib');
      if ( ! $this->upload->do_upload('image'))
      {
          $error = array('error' => $this->upload->display_errors());

          // Set the response and exit
          $this->response([
              'status'  => FALSE,
              'message' => 'not_uploaded',
              'error'   => $error,
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
      else
      {
          $data = array('upload_data' => $this->upload->data());

          $upload_data = $data['upload_data'];


            // $configer =  array(
            //   'image_library'   => 'gd2',
            //   'source_image'    =>  $upload_data['full_path'],
            //   'maintain_ratio'  =>  TRUE,
            //   'width'           =>  1200,
            //   'height'          =>  840,
            // );
            // $this->image_lib->clear();
            // $this->image_lib->initialize($configer);
            // $this->image_lib->resize();

          $upload_data['raw_name'].$upload_data['file_ext'];
          
          $user = array(
            $this->input->post('type') => $upload_data['raw_name'].$upload_data['file_ext'],
          );
          
          $where = array('user_id' => $this->token_data->id);

          if( $this->common_model->update_entry('users', $user, $where) ) {


            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data' => 'image_uploaded_updated',
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
          } else {

            // Set the response and exit
            $this->response([
                'status'  => FALSE,
                'message' => 'not_updated_db_error',
                'error'   => 'Something went wrong, unable to update preview image.',
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code            
          }          
      }

    }

    public function get_user_info_get($username="") {

      if ( !empty($username) ) {
        
        $user = $this->user_model->get_user_info( array('users.username' => $username) );
      } else {

        $user = $this->user_model->get_user_info( array('users.user_id' => $this->token_data->id) );
      }

      if ( !empty($user) ) {
          
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => $user,
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code        
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No user were found',
                'error' => array('No user were found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }

    public function get_user_points_get() {

      $points = $this->user_model->get_user_points( $this->token_data->id );

      if ( !empty($points) ) {
          
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => $points,
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code        
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No data was found',
                'error' => array('No data was found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }

    public function get_story_get()
    {
        $story_id = $this->uri->segment(4);


        // $story = $this->common_model->get_data( 'stories', array('story_id' => $story_id) );
        $story = $this->common_model->get_story($story_id);

        // Check if the categories data store contains categories (in case the database result returns NULL)
        if ( !empty($story) ) {

          if ( $this->token_data->id == $story[0]->author_id ) {
            
            $story[0]->description = html_entity_decode($story[0]->description);
            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data' => $story,
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
          } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'different_author',
                'error' => array('You do not have access to this story.'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code            
          }
        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No stories were found',
                'error' => array('No stories were found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
      
    }

    public function get_user_story_details_get()
    {
        $story_id = $this->uri->segment(4);

        $story = $this->user_model->get_user_story_details($story_id);

        // Check if the categories data store contains categories (in case the database result returns NULL)
        if ( !empty($story) ) {

          if ( $this->token_data->id == $story[0]->author_id ) {

            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data' => $story,
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
          } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'different_author',
                'error' => array('You do not have access to this story.'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code            
          }
        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No stories were found',
                'error' => array('No stories were found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
      
    }

    public function get_story_views_get()
    {
        $story_id = $this->uri->segment(4);

        $story_views = $this->user_model->get_story_views($story_id);

        // Check if the categories data store contains categories (in case the database result returns NULL)
        if ( !empty($story_views) ) {

            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data' => $story_views,
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No views were found',
                'error' => array('No views were found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
      
    }

    public function update_meta_info_post()
    {
      $where = array('user_id' => $this->token_data->id);
      foreach ($_POST as $key => $value) {
        
        $where['meta_key']   = $key;
        
        $data = array( 'meta_value' => $this->input->post($key) );

        if( $this->common_model->data_exists('usermeta', $where) > 0 ) {

          $this->common_model->update_entry('usermeta', $data, $where);

          // Set the response and exit
          $this->response(  
            array( 'status' => TRUE, 'message' => 'Meta info updated', ), 
            REST_Controller::HTTP_OK
          ); // OK (200) being the HTTP response code
        } else {

          $data['user_id']    = $this->token_data->id;
          $data['meta_key']   = $key;
          $this->common_model->insert_entry('usermeta', $data);

          // Set the response and exit
          $this->response(  
            array( 'status' => TRUE, 'message' => 'Meta info added', ), 
            REST_Controller::HTTP_OK
          ); // OK (200) being the HTTP response code          
        }
        
      }
    }

    public function update_user_name_post() {
      
      $data  = array( 'first_name' => $this->input->post('first_name'), 'last_name' => $this->input->post('last_name') );
      $where = array( 'user_id' => $this->token_data->id );
      if( $this->common_model->update_entry('users', $data, $where) ) {

        // Set the response and exit
        $this->response(  
          array( 'status' => TRUE, 'message' => 'name updated', ), 
          REST_Controller::HTTP_OK
        ); // OK (200) being the HTTP response code
      } else {

        // Set the response and exit
        $this->response([
            'status' => FALSE,
            'message' => 'Unable to update name in db',
            'error' => array('Unable to update name in db'),
        ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }

    public function add_tag_to_story_post()
    {

      $tag_data = array( 'story_id' => $this->input->post('story_id'), 'tag_id' => $this->input->post('tag_id') );

      if( $this->common_model->data_exists( 'story_tags',  $tag_data) == 0 ) {

        if( $this->common_model->insert_entry( 'story_tags', $tag_data ) ) {

            // Set the response and exit
            $this->response(  
              array( 'status' => TRUE, 'message' => 'tag added to story', ), 
              REST_Controller::HTTP_OK
            ); // OK (200) being the HTTP response code
        }
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'Tag already added to story',
                'error' => array('Tag already added to story'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }

    public function add_new_tag_to_story_post()
    {

      $tag_data = array( 'status' => 1, 'name' => ucfirst($this->input->post('tag_name')), 'created_by' => $this->token_data->id );

      if( $this->common_model->insert_entry( 'tags', $tag_data ) ) {

        $tag_id = $this->db->insert_id();
        $story_tag_data = array( 'story_id' => $this->input->post('story_id'), 'tag_id' => $tag_id );

        if( $this->common_model->insert_entry( 'story_tags', $story_tag_data ) ) {

            // Set the response and exit
            $this->response(  
              array( 'status' => TRUE, 'message' => 'tag added to story', ), 
              REST_Controller::HTTP_OK
            ); // OK (200) being the HTTP response code
        }
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'Unable to save tag',
                'error' => array('Unable to save tag'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }

    public function add_new_topic_post()
    {

      $topic_data = array( 'status' => 1, 'name' => ucfirst($this->input->post('topic_name')), 'created_by' => $this->token_data->id );

      if( $this->common_model->insert_entry( 'topics', $topic_data ) ) {

        $topic_id = $this->db->insert_id();

        // Set the response and exit
        $this->response(  
          array( 
            'status' => TRUE, 
            'data' => array('topic_id' => $topic_id, 'topic_name' => $this->input->post('topic_name')), 
            'message' => 'New topic created', ),
          REST_Controller::HTTP_OK
        ); // OK (200) being the HTTP response code

      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'Unable to create new topic',
                'error' => array('Unable to create new topic'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }

    public function remove_tag_from_story_post()
    {

      $tag_data = array( 'story_id' => $this->input->post('story_id'), 'tag_id' => $this->input->post('tag_id') );

      if( $this->common_model->data_exists( 'story_tags',  $tag_data) > 0 ) {

        if( $this->common_model->delete_entry( 'story_tags', $tag_data ) ) {

            // Set the response and exit
            $this->response(  
              array( 'status' => TRUE, 'message' => 'tag removed from story', ), 
              REST_Controller::HTTP_OK
            ); // OK (200) being the HTTP response code
        }
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'Tag do not exists in this story',
                'error' => array('Tag do not exists in this story'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }


    public function get_user_draft_stories_get()
    {
        
        $story = $this->common_model->get_data( 'stories', array('author_id' => $this->token_data->id, 'status' => 0) );

        // Check if the categories data store contains categories (in case the database result returns NULL)
        if ( !empty($story) ) {

            $story[0]->description = html_entity_decode($story[0]->description);
            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data' => $story,
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code

        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No stories were found',
                'error' => array('No stories were found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
      
    }

    public function get_user_published_stories_get()
    {
        
        $story = $this->common_model->get_data( 'stories', array('author_id' => $this->token_data->id, 'status' => 1) );

        // Check if the categories data store contains categories (in case the database result returns NULL)
        if ( !empty($story) ) {

            $story[0]->description = html_entity_decode($story[0]->description);
            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data' => $story,
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code

        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No stories were found',
                'error' => array('No stories were found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
      
    }

    public function get_tags_get()
    {
        $tags = $this->common_model->get_data('tags', array('status' => 1));

        // Check if the categories data store contains categories (in case the database result returns NULL)
        if ( !empty($tags) ) {

            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data'   => $tags,
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code

        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No tags were found',
                'error' => array('No tags were found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
      
    }    


    public function get_topics_get()
    {
        $topics = $this->common_model->get_data('topics');

        // Check if the categories data store contains categories (in case the database result returns NULL)
        if ( !empty($topics) ) {

            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data'   => $topics,
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code

        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No topics were found',
                'error' => array('No topics were found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
      
    }    

    public function get_user_stories_count_get() {

      $count = $this->common_model->data_exists( 'stories', array('author_id' => $this->token_data->id, 'status'  => STORY_STATUS_PUBLISHED) );

      // Set the response and exit
      $this->response(  
        array(
          'status' => TRUE,
          'data' => $count,
        ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
    }

    public function get_user_stories_get($limit, $offset)
    {
      $stories = $this->common_model->get_stories( 
        array(
          'stories.status'    => STORY_STATUS_PUBLISHED, 
          'stories.author_id' => $this->token_data->id
        ), 
        $limit,
        $offset,
        $order = ''
      );

      // Check if the categories data store contains categories (in case the database result returns NULL)
      if ( !empty($stories) ) {

          foreach ($stories as $story) {
            
            $story->tags = $this->common_model->get_story_tags($story->story_id);
          }
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => $stories,
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'No stories were found'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }    


    public function like_story_post()
    {
        
        $data = array('story_id' => $this->input->post('story_id'), 'user_id' => $this->token_data->id);

        if ($this->common_model->data_exists('story_user_likes', $data) == 0) {
          if ( $this->common_model->insert_entry('story_user_likes', $data) ) {

              $this->verify_likes_points($this->input->post('story_id'));

              // Set the response and exit
              $this->response(  
                array(
                  'status' => TRUE,
                  'data'   => 'Liked the story',
                ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
          } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'Unable to update in db',
                'error' => array('Unable to update in db'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code            
          }
        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'Already liked by this user',
                'error' => array('Already liked by this user'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
      
    }


    public function viewed_story_post() {
        
        $data = array('story_id' => $this->input->post('story_id'), 'user_id' => $this->token_data->id);

        if ($this->common_model->data_exists('story_user_views', $data) == 0) {
          if ( $this->common_model->insert_entry('story_user_views', $data) ) {

              $this->verify_likes_points($this->input->post('story_id'));

              // Set the response and exit
              $this->response(  
                array(
                  'status' => TRUE,
                  'data'   => 'Viewed the story',
                ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
          } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'Unable to update in db',
                'error' => array('Unable to update in db'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code            
          }
        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'Already viewed by this user',
                'error' => array('Already viewed by this user'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
      
    }


    public function report_story_post()
    {
        
        $data = array('post_id' => $this->input->post('post_id'), 'flagged_by' => $this->token_data->id);

        if ($this->common_model->data_exists('flagged_posts', $data) == 0) {
          if ( $this->common_model->insert_entry('flagged_posts', $data) ) {

              // Set the response and exit
              $this->response(  
                array(
                  'status' => TRUE,
                  'data'   => 'Reported the story',
                ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
          } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'Unable to update in db',
                'error' => array('Unable to update in db'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code            
          }
        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'Already reported by this user',
                'error' => array('You have already reported this story.'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
      
    }



    /**
     * get access token from header
     * */
    function getBearerToken($authorization) {
        
        // HEADER: Get the access token from the header
        if (!empty($authorization)) {
            if (preg_match('/Bearer\s(\S+)/', $authorization, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }

    public static function slugify($text)
    {
      // replace non letter or digits by -
      $text = preg_replace('~[^\pL\d]+~u', '-', $text);

      // transliterate
      $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

      // remove unwanted characters
      $text = preg_replace('~[^-\w]+~', '', $text);

      // trim
      $text = trim($text, '-');

      // remove duplicate -
      $text = preg_replace('~-+~', '-', $text);

      // lowercase
      $text = strtolower($text);

      if (empty($text)) {
        return 'n-a';
      }

      return $text;
    }    

    function time_elapsed_string($datetime, $full = false) {
        // added hours to match mysql time with server
        $datetime = date( "Y-m-d H:i:s", 
          strtotime('+5 hours', strtotime($datetime)) );
        
        $now = new DateTime();
        $ago = new DateTime($datetime);
        
        $diff = $now->diff($ago);
        
        $diff->w = floor($diff->d / 7);
        $diff->d -= $diff->w * 7;

        $string = array(
            'y' => 'year',
            'm' => 'month',
            'w' => 'week',
            'd' => 'day',
            'h' => 'hour',
            'i' => 'minute',
            's' => 'second',
        );
        foreach ($string as $k => &$v) {
            if ($diff->$k) {
                $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
            } else {
                unset($string[$k]);
            }
        }

        if (!$full) $string = array_slice($string, 0, 1);
        return $string ? implode(', ', $string) . ' ago' : 'just now';
    }

  private function verify_likes_points($story_id) {

    $likes_count = $this->common_model->data_exists( 'story_user_likes', array('story_id' => $story_id) );

    $points = 0;

    if ( $likes_count == 10 ) {
      $points = POINTS_FOR_10_LIKES;
    } else if ( $likes_count == 20 ) {
      
      $points = POINTS_FOR_20_LIKES;
    } else if ( $likes_count == 30 ) {
      
      $points = POINTS_FOR_30_LIKES;
    }

    if ( $points > 0 ) {
      // get author from story
      $story = $this->common_model->get_story_author($story_id);
      
      // update and get total points of user
      $user_points = $this->common_model->update_user_points($story->author_id, $points);

      // points allocation data
      $points_data = array(
        'user_id'   => $story->author_id,
        'points'    => $points,
        'milestone' => $likes_count,
        'activity'  => 'likes',
        'selector'  => 'story',
        'selector_id'  => $story_id,
        'total_points' => $user_points->points,
      );

      // insert points allocation log
      $this->common_model->insert_entry('points_allocation', $points_data);

    }

  } 

}
