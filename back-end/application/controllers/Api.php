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
class Api extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        $this->methods['get_users_get']['limit'] = 500; // 500 requests per hour per user/key
        $this->methods['users_post']['limit'] = 100; // 100 requests per hour per user/key
        $this->methods['users_delete']['limit'] = 50; // 50 requests per hour per user/key

        // $this->load->model()

        if ( !is_null($this->input->get_request_header('Authorization')) ) {

          $authorization = $this->input->get_request_header('Authorization');
          
          $token    = $this->getBearerToken($authorization);
          $jwt_key  = $this->config->item('thekey');

          try {
             
             $this->token_data = JWT::decode($token, $jwt_key, array('HS256'));

          } catch (Exception $e) {

          }

        }       
    }


    public function register_post() {

        $post_data = json_decode(file_get_contents("php://input"));
        
        if ( trim($post_data->first_name) == "" || trim($post_data->last_name) == "" || trim($post_data->email) == "" ) {
          
            $message = array('message' => 'validation_error', 'status' => 204); // no content
        } else {

          $user_exists = $this->common_model->data_exists( 'users', array('user_email' => $post_data->email) );

          $password = $this->_randomPassword();
          $password_hashed = password_hash($password, PASSWORD_DEFAULT);

          // User already have an account
          if ( $user_exists ) {
              
              $user = $this->common_model->get_data( 'users', array('user_email' => $post_data->email) );
              
              $jwt_token = $this->_generate_jwt_token($user);

              $message = array(
                'message' => 'email_exists', 
                'token'   => $jwt_token,
                'data'    => array( 'user_type' => $user[0]->user_type, 'username' => $user[0]->username ),
                'status'  => 201
              );
          } else {

              if ( isset($post_data->username) ) {
                
                $username = strtolower($post_data->username);
              } else {

                $username = $this->_generate_username($post_data->first_name.''.$post_data->last_name);
              }


              $user_data = array(
                  'first_name'    => $post_data->first_name,
                  'last_name'     => $post_data->last_name,
                  'username'      => $username,
                  'user_type'     => 'user',
                  'status'        => 1,
                  'user_email'    => $post_data->email,
                  'profile_pic'   => isset($post_data->photoUrl) ? $post_data->photoUrl : '',
                  'password'      => $password_hashed
              );
              
              // Insert user in database
              if ($this->common_model->insert_entry('users', $user_data)) {
                  
                $message = array('message' => 'Registered new user', 'data' => array( 'username' => $username ),'status' => 200);
              }
          }

        }

        // Set the response and exit
        $this->response($message, REST_Controller::HTTP_OK); // OK (200) being the HTTP response code            
             
    }

    public function login_post() {

        // convert json post data to array
        $post_data = json_decode(file_get_contents("php://input"));

        // login using email
        if ( strpos($post_data->email, '@') ) {

            $user_data = array(
                'email'     => $post_data->email,
                'password'  => $post_data->password,
            );
            
            $message = $this->_login_by_email($user_data);
        } else {
        // login using username

            $user_data = array(
                'username'    => $post_data->email,
                'password'    => $post_data->password,
            );
            
            $message = $this->_login_by_username($user_data);
        }

        // Set the response and exit
        $this->response($message, REST_Controller::HTTP_OK); // OK (200) being the HTTP response code            
    }

    public function check_username_get()
    {
      
      $username   = $this->input->get('username');
      $user_count = 0;

      if ( $username !== NULL ) {
        
        $user_count = $this->common_model->data_exists( 'users', array('username' => $username) );
        
        $message = [
            'message' => $user_count,
            'status' => 200
        ];
      } else {
        
        $message = [
            'message' => $user_count,
            'status' => 200
        ];        
      }
      // Set the response and exit
      $this->response($message, REST_Controller::HTTP_OK); // OK (200) being the HTTP response code            
    }

    public function forgot_password_post()
    {
    
      // convert json post data to array
      $post_data  = json_decode(file_get_contents("php://input"));      
      $email      = trim($post_data->email) == "" ? NULL : trim($post_data->email);
      
      if ( $email !== NULL ) {
        
        $user = $this->common_model->get_data( 'users', array('user_email' => $email) );
        
        if ( !empty($user) ) {
          
          // $this->send_forgot_password_email($email);
          $message = array('message' => 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.', 'status' => 200);
              
        } else {

          $message = [
              'message' => "Can't find that email, sorry.",
              'error' => array("Can't find that email, sorry."),
              'status' => 201
          ];          
        }
      } else {
        
        $message = [
            'message' => 'Email is required.',
            'error' => array('Email is required.'),
            'status' => 201,
        ];        
      }
      // Set the response and exit
      $this->response($message, REST_Controller::HTTP_OK); // OK (200) being the HTTP response code            
    }

    function _generate_username($username)
    {

      $user_count = $this->common_model->data_exists('users', array('username' => $username));

      if ($user_count > 0) {

        while ($user_count > 0) {
          
          $username   = $username.'_'.rand(0, 100);
          $user_count = $this->common_model->data_exists('users', array('username' => $username));
        }
        
        
      } else {

      }

      return strtolower($username);
    }

    function _login_by_username($user_data)
    {
        
        // get user 
        $user = $this->common_model->get_data( 'users', array('username' => $user_data['username']) );

        if ( count($user) > 0 ) {
          
          if ( $user[0]->status == 1 ) {

            // verify $password
            if (password_verify($user_data['password'], $user[0]->password)) {

                $jwt_token = $this->_generate_jwt_token($user);

                $message = [
                    'message' => 'Logged In',
                    'data'    => array( 'user_type' => $user[0]->user_type, 'username' => $user[0]->username ),
                    'token'   => $jwt_token,
                    'status'  => 200
                ];
            } else {
                
                $message = [
                    'message' => 'Wrong password',
                    'error'   => array('Incorrect username or password.'),
                    'status' => 201
                ];
            }

          } else {

            $message = [
                'message' => 'Account is not active.',
                'error'   => array('Account is not active.'),
                'status' => 201
            ];            
          }

        } else {

            $message = [
                'message' => 'Username not found.',
                'error'   => array('Incorrect username or password.'),
                'status' => 201
            ];
        }

        return $message;
    }

    function _login_by_email($user_data)
    {
        
        // get user 
        $user = $this->common_model->get_data( 'users', array('user_email' => $user_data['email']) );

        if ( count($user) > 0 ) {
            
            if ( $user[0]->status == 1 ) {
              
              // verify $password
              if (password_verify($user_data['password'], $user[0]->password)) {

                  $jwt_token = $this->_generate_jwt_token($user);

                  $message = [
                      'message' => 'Logged In',
                      'data'    => array( 'user_type' => $user[0]->user_type, 'username' => $user[0]->username ),
                      'token'   => $jwt_token,
                      'status'  => 200
                  ];
              } else {
                  
                  $message = [
                      'message' => 'Wrong password',
                      'error'   => array('Incorrect email or password.'),
                      'status' => 201
                  ];
              }

            }  else {

              $message = [
                  'message' => 'Account is not active.',
                  'error'   => array('Account is not active.'),
                  'status' => 201
              ];
            }
            
        } else { // user does not exists

            $message = [
                'message' => 'Email not found.',
                'error'   => array('Incorrect email or password.'),
                'status' => 201
            ];
        }

        return $message;
    }

    function _randomPassword() {
        $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 8; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }

    function _generate_jwt_token($user) {

      $jwt_key = $this->config->item('thekey');

      $date = new DateTime();

      $token['id'] = $user[0]->user_id;  //From here
      $token['username'] = $user[0]->username;
      $token['user_type'] = $user[0]->user_type;
      $token['iat'] = $date->getTimestamp();
      $token['exp'] = $date->getTimestamp() + 60*60*5; //To here is to generate token
      return JWT::encode($token,$jwt_key ); //This is the output token
    }


    public function story_description_image_upload_post() { 

      $config['upload_path']          = './assets/uploads/';
      $config['allowed_types']        = 'gif|jpg|png|jpeg';
      $config['max_size']             = 2048;
      // $config['max_width']            = 1024;
      // $config['max_height']           = 768;

      $this->load->library('upload', $config);

      if ( ! $this->upload->do_upload('description_image'))
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

            // Set the response and exit
          $this->response(  
            array(
              'link'  => base_url().'assets/uploads/'.$upload_data['raw_name'].$upload_data['file_ext'],
            ), REST_Controller::HTTP_OK
          ); // OK (200) being the HTTP response code
          
      }

    }

    public function get_stories_get()
    {

      $stories = $this->common_model->get_stories( array('stories.status' => STORY_STATUS_PUBLISHED) );

      // Check if the categories data store contains categories (in case the database result returns NULL)
      if ( !empty($stories) ) {

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

    public function get_featured_stories_get($limit, $offset)
    {

      $featured_stories = $this->common_model->get_stories( array('stories.status' => STORY_STATUS_PUBLISHED, 'stories.featured' => 1), $limit, $offset, $order = 'random' );

      // Check if the categories data store contains categories (in case the database result returns NULL)
      if ( !empty($featured_stories) ) {

          foreach ($featured_stories as $story) {
            
            $story->tags = $this->common_model->get_story_tags($story->story_id);
          }
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => $featured_stories,
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'No stories were found'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }


    public function search_stories_post($limit, $offset)
    {
      
      $where = array( 'stories.status'  => STORY_STATUS_PUBLISHED );

      if ( $this->input->post('search_tag') != "" ) {
        
        $where['story_tags.tag_id'] = $this->input->post('search_tag');
      }

      if ( $this->input->post('search_author') != "" ) {

        $where['stories.author_id'] = $this->input->post('search_author');
      }

      if ( $this->input->post('search_text') != "" ) {
        
        $like  = array('stories.title' => $this->input->post('search_text'));
      } else {

        $like  = "";
      }

      $stories = $this->common_model->get_stories( $where, $limit, $offset, ''/*order*/,  $like );

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

    public function search_tags_get($search_tag)
    {

      $tags = $this->common_model->get_searched_tags( 
        array( 'tags.status'  => TAG_STATUS_PUBLISHED ), //where
        $search_tag // like
      );

      // Check if the categories data store contains categories (in case the database result returns NULL)
      if ( !empty($tags) ) {
          
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => $tags,
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'No tags were found'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }

    public function search_authors_get($search_author)
    {

      $authors = $this->common_model->get_searched_authors( 
        array( 'users.status'  => 1 ), //where
        $search_author // like
      );

      // Check if the categories data store contains categories (in case the database result returns NULL)
      if ( !empty($authors) ) {
          
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => $authors,
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'No authors were found'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }


    public function get_story_data_get()
    {

      $story_slug = $this->uri->segment(3);

      $story = $this->common_model->get_story_data( array('stories.slug' => $story_slug));

      // Check if the categories data store contains categories (in case the database result returns NULL)
      if ( !empty($story) ) {

          if ( $story[0]->status ==  STORY_STATUS_PUBLISHED || $story[0]->author_id ==  $this->token_data->id ) {
            
            // if user is logged in
            if (isset($this->token_data)) { 

              $liked_where = array('story_id' => $story[0]->story_id, 'user_id' => $this->token_data->id);
              
              // check if user liked this story
              $story[0]->liked = $this->common_model->data_exists('story_user_likes',  $liked_where) ? true : false;

            } else {

              $story[0]->liked = false;
            }

            $story[0]->tags = $this->common_model->get_story_tags($story[0]->story_id);
            
            $story[0]->description = html_entity_decode($story[0]->description);

            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data' => $story[0],
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
          }
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'No stories were found'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }

    public function get_story_comments_get($story_id)
    {
      
      if ( isset($this->token_data) ) {
        
        $comments = $this->common_model->get_story_comments_for_user(0, $story_id, $this->token_data->id);
      } else {

        $comments = $this->common_model->get_story_comments(0, $story_id);
      }
      
      if ( !empty($comments) ) {
        
        foreach ($comments as $comment) {
          if ( isset($this->token_data) ) {
            
            $comment->children = $this->common_model->get_story_comments_for_user($comment->comment_id, $story_id, $this->token_data->id);
          } else {

            $comment->children = $this->common_model->get_story_comments($comment->comment_id, $story_id);
          }
      
        }

        // Set the response and exit
        $this->response(  
          array(
            'status' => TRUE,
            'data'   => $comments,
          ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code      
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'No comments were found'
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
    

}
