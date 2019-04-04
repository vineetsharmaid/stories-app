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


    function save_story_post()
    {

      // convert json post data to array
      $post_data = json_decode(file_get_contents("php://input"));

      $user = $this->common_model->get_data('users', array('username' => $this->token_data->username));
      $title  = trim( strip_tags($post_data->title) );
      $slug   = strtolower( str_replace(' ', '-', $title) );

      $story = array(
        'title'  => trim( strip_tags($post_data->title) ),
        'slug'   => $slug,
        'status' => 0,
        'author_id' => $user[0]->user_id,
        'description' => htmlEntities($post_data->description, ENT_QUOTES),
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

      $user = $this->common_model->get_data('users', array('username' => $this->token_data->username));

      $title  = trim( strip_tags($post_data->title) );
      $slug   = strtolower( str_replace(' ', '-', $title) );

      $story = array(
        'title' => trim( strip_tags($post_data->title) ),
        'slug'   => $slug,
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

    public function get_user_info_get() {

      $user = $this->common_model->get_data( 'users', array('username' => $this->token_data->username) );

      if ( !empty($user) ) {
          
          $user_data = array(
              'first_name'  => $user[0]->first_name,
              'last_name'   => $user[0]->last_name,
              'profile_pic' => $user[0]->profile_pic,
              'user_email'  => $user[0]->user_email,
              'user_type'   => $user[0]->user_type,
              'username'    => $user[0]->username,
            );

          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => $user_data,
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

      $tag_data = array( 'status' => 1, 'name' => $this->input->post('tag_name'), 'created_by' => $this->token_data->id );

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

    public function get_tags_get()
    {
        $tags = $this->common_model->get_data('tags');

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


    public function like_story_post()
    {
        
        $data = array('story_id' => $this->input->post('story_id'), 'user_id' => $this->token_data->id);

        if ($this->common_model->data_exists('story_user_likes', $data) == 0) {
          if ( $this->common_model->insert_entry('story_user_likes', $data) ) {

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
