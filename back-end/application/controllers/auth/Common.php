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
class Common extends REST_Controller {

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

    public function get_users_get()
    {
 
        $id = $this->get('id');

        // If the id parameter doesn't exist return all the users

        if ($id === NULL) {
            
            $users = $this->common_model->get_users('users');

            // Check if the users data store contains users (in case the database result returns NULL)
            if ( !empty($users) ) {

                // Set the response and exit
                $this->response(  
                  array(
                    'status' => TRUE,
                    'data' => $users,
                  ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
            } else {

                // Set the response and exit
                $this->response([
                    'status' => FALSE,
                    'message' => 'No users were found'
                ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
            }
        }

    }

    public function users_post()
    {
        // $this->some_model->update_user( ... );
        $message = [
            'id' => 100, // Automatically generated by the model
            'name' => $this->post('name'),
            'email' => $this->post('email'),
            'message' => 'Added a resource'
        ];

        $this->set_response($message, REST_Controller::HTTP_CREATED); // CREATED (201) being the HTTP response code
    }

    public function users_delete()
    {
        $id = (int) $this->get('id');

        // Validate the id.
        if ($id <= 0)
        {
            // Set the response and exit
            $this->response(NULL, REST_Controller::HTTP_BAD_REQUEST); // BAD_REQUEST (400) being the HTTP response code
        }

        // $this->some_model->delete_something($id);
        $message = [
            'id' => $id,
            'message' => 'Deleted the resource'
        ];

        $this->set_response($message, REST_Controller::HTTP_NO_CONTENT); // NO_CONTENT (204) being the HTTP response code
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

      // $token['id'] = $user[0]->user_id;  //From here
      $token['username'] = $user[0]->username;
      $token['iat'] = $date->getTimestamp();
      $token['exp'] = $date->getTimestamp() + 60*60*1; //To here is to generate token
      return JWT::encode($token,$jwt_key ); //This is the output token
    }

    function save_story_post()
    {

      // convert json post data to array
      $post_data = json_decode(file_get_contents("php://input"));

      $user = $this->common_model->get_data('users', array('username' => $post_data->username));

      $story = array(
        'title' => trim( strip_tags($post_data->title) ),
        'description' => htmlEntities($post_data->description, ENT_QUOTES),
        'author_id' => $user[0]->user_id,
        'status' => 0
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

    function update_story_post()
    {

      // convert json post data to array
      $post_data = json_decode(file_get_contents("php://input"));

      $user = $this->common_model->get_data('users', array('username' => $post_data->username));

      $story = array(
        'title' => trim( strip_tags($post_data->title) ),
        'description' => htmlEntities($post_data->description, ENT_QUOTES),
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


    function submit_story_for_review_post()
    {

      // convert json post data to array
      $post_data = json_decode(file_get_contents("php://input"));

      $user = $this->common_model->get_data('users', array('username' => $post_data->username));
      
      $story = array(
        'preview_title' => trim( strip_tags($post_data->previewTitle) ),
        'preview_subtitle' => trim( strip_tags($post_data->previewSubtitle) ),
        'author_id' => $user[0]->user_id,
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


    public function image_upload_post() { 
      
      $config['upload_path']          = './assets/uploads/';
      $config['allowed_types']        = 'gif|jpg|png';
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


    public function story_description_image_upload_post() { 

      $config['upload_path']          = './assets/uploads/';
      $config['allowed_types']        = 'gif|jpg|png';
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

    public function get_story_get()
    {
        $story_id = $this->uri->segment(3);


        $story = $this->common_model->get_data( 'stories', array('story_id' => $story_id) );

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
