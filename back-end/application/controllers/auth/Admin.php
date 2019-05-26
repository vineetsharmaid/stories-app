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
class Admin extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        $this->methods['get_users_get']['limit'] = 500; // 500 requests per hour per user/key
        $this->methods['users_post']['limit'] = 100; // 100 requests per hour per user/key
        $this->methods['users_delete']['limit'] = 50; // 50 requests per hour per user/key

        $this->load->model('admin_model');
        $this->load->model('user_model');
        $this->load->helper('common_helper');

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
             
             $admins = array('admin', 'superadmin');
             if ( !in_array($this->token_data->user_type, $admins) ) {
                    
                // Set the response and exit
                $this->response([
                    'status' => FALSE,
                    'message' => 'auth_error',
                    'error' => 'Do not have admin access',
                ], 401);               
             }

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

    public function get_subscribers_get()
    {
            
        $subscribers = $this->common_model->get_data('newsletter_subscribers');

        // Check if the users data store contains users (in case the database result returns NULL)
        if ( !empty($subscribers) ) {

            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data' => $subscribers,
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No subscribers were found'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
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

    public function add_category_post() {

        // convert json post data to array
        $post_data = json_decode(file_get_contents("php://input"));

        if ( $post_data->parent != "" && !is_numeric($post_data->parent) ) {
          

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'validation_error',
              'error' => array('Selected parent category not found.'),
          ], REST_Controller::HTTP_BAD_REQUEST); // NOT_FOUND (404) being the HTTP response code

        }

        if ( trim($post_data->name) == "" || trim($post_data->description) == "" ) {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'validation_error',
              'error' => array('Please fill all the required fields.'),
          ], REST_Controller::HTTP_BAD_REQUEST); // NOT_FOUND (404) being the HTTP response code


        } else {

          $category = array(
            'name' => trim($post_data->name),
            'description' => trim($post_data->description),
            'status' => (int) $post_data->status,
            'parent' => $post_data->parent == '' ? 0 : (int) $post_data->parent,
          );
          
          if( $this->common_model->insert_entry('categories', $category) ) {

            // Set the response and exit
            $this->response([
                'status' => TRUE,
                'message' => 'category_created',
            ], REST_Controller::HTTP_OK); // NOT_FOUND (404) being the HTTP response code
          } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'database_error',
                'error' => array('Something went wrong, unable to add category.'),
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR); // NOT_FOUND (404) being the HTTP response code
          }

        }

    }

    public function edit_category_post() {

        // convert json post data to array
        $post_data = json_decode(file_get_contents("php://input"));

        $data_error = array();

        if ( $post_data->parent != "" && !is_numeric($post_data->parent) ) {
            
          array_push($data_error, 'Selected parent category not found.');
        }

        if ( trim($post_data->cat_id) == "" ) {

          array_push($data_error, 'Category ID not provided.');
        }

        if ( trim($post_data->name) == "" || trim($post_data->description) == "" ) {

          array_push($data_error, 'Please fill all the required fields.');
        }

        if ( !empty($data_error) ) {
          
          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'validation_error',
              'error' => $data_error,
          ], REST_Controller::HTTP_BAD_REQUEST); // NOT_FOUND (404) being the HTTP response code

        } else {

          $category = array(
            'name' => trim($post_data->name),
            'description' => trim($post_data->description),
            'status' => (int) $post_data->status,
            'parent' => $post_data->parent == '' ? 0 : (int) $post_data->parent,
          );

          $where = array( 'cat_id' => $post_data->cat_id );
          
          if( $this->common_model->update_entry('categories', $category, $where) ) {

            // Set the response and exit
            $this->response([
                'status' => TRUE,
                'message' => 'category_updated',
                'data' => $where,
            ], REST_Controller::HTTP_OK); // NOT_FOUND (404) being the HTTP response code
          } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'database_error',
                'error' => array('Something went wrong, unable to update category.'),
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR); // NOT_FOUND (404) being the HTTP response code
          }

        }

    }


    public function get_categories_get()
    {
 
        $cat_id = $this->uri->segment(4);

        // If the id parameter doesn't exist return all the categories
        if ($cat_id === NULL) {

          $categories = $this->common_model->get_categories();
        } else {
          
          // Find and return a single record.
          $cat_id = (int) $cat_id;

          $categories = $this->common_model->get_category($cat_id);
        }

        // Check if the categories data store contains categories (in case the database result returns NULL)
        if ( !empty($categories) ) {

            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data' => $categories,
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No categories were found'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }


    }


    public function get_tags_get()
    {
 
        $tag_id = $this->uri->segment(4);

        // If the id parameter doesn't exist return all the tags
        if ($tag_id === NULL) {

          $tags = $this->common_model->get_tags(array('tags.status' => 1));
        } else {
          
          // Find and return a single record.
          $tag_id = (int) $tag_id;

          $tags = $this->common_model->get_data('tags', array('tag_id' => $tag_id));
        }

        // Check if the tags data store contains tags (in case the database result returns NULL)
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

    public function get_pages_get()
    {
 
        $page_id = $this->uri->segment(4);

        // If the id parameter doesn't exist return all the pages
        if ($page_id === NULL) {

          $pages = $this->common_model->get_data('pages');
        } else {
          
          // Find and return a single record.
          $page_id = (int) $page_id;

          $pages = $this->common_model->get_data('pages', array('page_id' => $page_id));
        }

        // Check if the pages data store contains pages (in case the database result returns NULL)
        if ( !empty($pages) ) {

          foreach ($pages as $page) {
            
            $page->content = html_entity_decode($page->content);
          }
          
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => $pages,
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No pages were found'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }


    }


    function save_page_post()
    {
      
      $title = $this->input->post('title');
      $content = $this->input->post('content');
      $page_id = $this->input->post('page_id');
      
      // remove froala text
      if(strpos($content, '<p data-f-id="pbf"')) {
  
        $content = substr($content, 0, strpos($content, '<p data-f-id="pbf"'));
      }

      $page = array(
        'title'   => $title,
        'content' => htmlEntities($content, ENT_QUOTES),
      );
      
      // html_entity_decode($encodedHTML)

      if( $this->common_model->update_entry('pages', $page, array('page_id' => $page_id)) ) {

            // Set the response and exit
            $this->response([
                'status' => TRUE,
                'data' => array('page' => $page_id),
                'message' => 'page_saved',
            ], REST_Controller::HTTP_OK); // NOT_FOUND (404) being the HTTP response code
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'database_error',
                'error' => array('Something went wrong, unable to save page.'),
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR); // NOT_FOUND (404) being the HTTP response code
      }
    }


    public function get_topics_get()
    {
 
        $tag_id = $this->uri->segment(4);

        // If the id parameter doesn't exist return all the tags
        if ($tag_id === NULL) {

          $tags = $this->common_model->get_topics();
        } else {
          
          // Find and return a single record.
          $tag_id = (int) $tag_id;

          $tags = $this->common_model->get_topic($tag_id);
        }

        // Check if the tags data store contains tags (in case the database result returns NULL)
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

    public function add_tag_post() {
      
      $tag_data = array( 
        'status' => 1, 
        'name' => ucfirst( $this->input->post('tag') ),
        'created_by' => $this->token_data->id
      );

      if( $this->common_model->insert_entry( 'tags', $tag_data ) ) {
      
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => 'tag_added_successfully',
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'Unable to add tag'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }

    public function add_topic_post() {
      
      $topic_data = array( 
        'status' => 1, 
        'name' => ucfirst( $this->input->post('name') ),
        'icon_class' => $this->input->post('class'),
        'created_by' => $this->token_data->id
      );

      if( $this->common_model->insert_entry( 'topics', $topic_data ) ) {
      
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => 'topic_added_successfully',
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'Unable to add topic'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }

    public function add_company_post() {
     
      $config['upload_path']          = './assets/uploads/companies/';
      $config['allowed_types']        = 'gif|jpg|png|jpeg';
      $config['max_size']             = 2048*5;
      // $config['max_width']            = 1024;
      // $config['max_height']           = 768;

      $this->load->library('upload', $config);
      $this->load->library('image_lib');
      if ( ! $this->upload->do_upload('logo'))
      {
          $error = array('error' => $this->upload->display_errors());

          // Set the response and exit
          $this->response([
              'status'  => FALSE,
              'message' => 'Logo not uploaded',
              'error'   => $error,
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
      else
      {
          $data = array('upload_data' => $this->upload->data());

          $upload_data = $data['upload_data'];

          $upload_data['raw_name'].$upload_data['file_ext'];
          
          $company_data = array(         
            'name'  => $this->input->post('name'),
            'email' => $this->input->post('email'),
            'logo'  => $upload_data['raw_name'].$upload_data['file_ext'],
          );

          if( $this->common_model->insert_entry( 'companies', $company_data ) ) {
          
              // Set the response and exit
              $this->response(  
                array(
                  'status' => TRUE,
                  'data' => 'company_added_successfully',
                ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
          } else {

              // Set the response and exit
              $this->response([
                  'status' => FALSE,
                  'message' => 'Unable to add company'
              ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
          }
      }

    }


    public function get_companies_get() {
      
      $companies = $this->common_model->get_data( 'companies' );

      if( !empty($companies) ) {
      
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => $companies,
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'Unable to get companies'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }

    public function get_company_get() {
      
      $company_id = $this->uri->segment(4);

      $companies = $this->common_model->get_data( 'companies', array('company_id' => $company_id) );

      if( !empty($companies) ) {
      
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => $companies[0],
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'Unable to get company'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }


    public function edit_company_post() {

      $config['upload_path']          = './assets/uploads/companies/';
      $config['allowed_types']        = 'gif|jpg|png|jpeg';
      $config['max_size']             = 2048*5;
      // $config['max_width']            = 1024;
      // $config['max_height']           = 768;

      $this->load->library('upload', $config);
      $this->load->library('image_lib');
      if ( ! $this->upload->do_upload('logo'))
      {
          $error = array('error' => $this->upload->display_errors());

          // Set the response and exit
          $this->response([
              'status'  => FALSE,
              'message' => 'Logo not uploaded',
              'error'   => $error,
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
      else
      {
          $data = array('upload_data' => $this->upload->data());

          $upload_data = $data['upload_data'];

          $upload_data['raw_name'].$upload_data['file_ext'];
          
          $company_data = array(         
            'name'  => $this->input->post('name'),
            'email' => $this->input->post('email'),
            'logo'  => $upload_data['raw_name'].$upload_data['file_ext'],
          );

          $where = array( 'company_id' => $this->input->post('company_id') );

          if( $this->common_model->update_entry( 'companies', $company_data, $where ) ) {
          
              // Set the response and exit
              $this->response(  
                array(
                  'status' => TRUE,
                  'data' => 'company_updated_successfully',
                ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
          } else {

              // Set the response and exit
              $this->response([
                  'status' => FALSE,
                  'message' => 'Unable to update company'
              ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
          }
      }
    }

    public function edit_topic_post() {
      
      $topic_data = array( 
        'status' => 1,
        'name' => ucfirst( $this->input->post('name') ),
        'icon_class' => $this->input->post('class')
      );

      $where = array( 'topic_id' => $this->input->post('topic_id') );

      if( $this->common_model->update_entry( 'topics', $topic_data, $where ) ) {
      
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => 'topic_updated_successfully',
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'Unable to update topic'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }


    public function edit_tag_post() {
      
      $tag_data = array( 
        'status' => 1,
        'name' => ucfirst( $this->input->post('name') ),
      );

      $where = array( 'tag_id' => $this->input->post('tag_id') );

      if( $this->common_model->update_entry( 'tags', $tag_data, $where ) ) {
        
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => 'tag_updated_successfully',
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
      } else {

          // Set the response and exit
          $this->response([
              'status' => FALSE,
              'message' => 'Unable to update tag'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }


    public function get_dashboard_data_get()
    { 

        $users   = $this->common_model->data_exists( 'users' );
        $stories = $this->common_model->data_exists( 'stories' );
        $forum_answers = $this->common_model->data_exists( 'forum_answers' );
        $forum_questions = $this->common_model->data_exists( 'forum_questions' );

        $dashboard_data = array('users' => $users, 
          'stories' => $stories,
          'forum_answers' => $forum_answers,
          'forum_questions' => $forum_questions
        );

        // Check if the dashboard_data data store contains dashboard_data (in case the database result returns NULL)
        if ( !empty($dashboard_data) ) {

            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data' => $dashboard_data,
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No data found'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }


    }

    public function get_stories_by_review_status_get($review_status)
    { 

        $stories = $this->admin_model->get_stories( array('review' => $review_status) );

        // Check if the stories data store contains stories (in case the database result returns NULL)
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

    public function get_questions_post() {

      $where = array( 'forum_questions.status'  => $this->input->post('status') );
      $questions = $this->admin_model->get_questions($where);

      if ( !empty($questions) ) {

        foreach ($questions as $question) {
          
          $question->topics    = is_null($question->topics) ? [] : explode(',', $question->topics);
          $question->topic_ids = is_null($question->topic_ids) ? [] : explode(',', $question->topic_ids);
        }

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
            'message' => 'No questions were found'
        ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }
    
    public function get_answers_post() {

      $where = array( 'forum_answers.status'  => $this->input->post('status') );
      $answers = $this->admin_model->get_answers($where);

      if ( !empty($answers) ) {

        
        foreach ($answers as $answer) {
          
          $answer->answer    = is_null($answer->subject) ? null : html_entity_decode($answer->subject);

          // get in time ago format
          $answer->answered_ago = time_elapsed_string($answer->created);
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
            'message' => 'No answers were found'
        ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }

    public function get_user_register_data_get() {

      $users = $this->admin_model->get_user_register_data();

      if ( !empty($users) ) {
        // foreach ($users as $user) {
          
        //   $user->created = strtotime($user->created);
        // }
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
    
    public function get_average_post_engagement_get() {

      $this->db->select('count(distinct stories.story_id) as stories, count(story_user_likes.story_id) as likes');
      $this->db->from('stories');
      $this->db->join('story_user_likes', 'story_user_likes.story_id = stories.story_id', 'left');
      $this->db->where(array('stories.status' => STORY_STATUS_PUBLISHED));
      $likes_data = $this->db->get()->result();

      $avg_likes = [];
      $avg_likes['type'] = 'Likes';
      $avg_likes['data'] = round($likes_data[0]->likes/$likes_data[0]->stories);


      $this->db->select('count(distinct stories.story_id) as stories, count(story_user_shares.story_id) as shares');
      $this->db->from('stories');
      $this->db->join('story_user_shares', 'story_user_shares.story_id = stories.story_id', 'left');
      // $this->db->join('comments', 'comments.story_id = stories.story_id', 'left');
      $this->db->where(array('stories.status' => STORY_STATUS_PUBLISHED));
      $shares_data = $this->db->get()->result();
      
      $avg_shares = [];
      $avg_shares['type'] = 'Shares';
      $avg_shares['data'] = round($shares_data[0]->shares/$shares_data[0]->stories);

      $this->db->select('count(distinct stories.story_id) as stories, count(comments.story_id) as comments');
      $this->db->from('stories');
      $this->db->join('comments', 'comments.story_id = stories.story_id', 'left');
      $this->db->where(array('stories.status' => STORY_STATUS_PUBLISHED));
      $comments_data = $this->db->get()->result();
      
      $avg_comments = [];
      $avg_comments['type'] = 'Comments';
      $avg_comments['data'] = round($comments_data[0]->comments/$comments_data[0]->stories);

      $data[] = $avg_likes;
      $data[] = $avg_shares;
      $data[] = $avg_comments;

      if ( !empty($data) ) {
        // Set the response and exit
        $this->response(
          array(
            'status' => TRUE,
            'data' => $data,
          ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
      } else {

        // Set the response and exit
        $this->response([
            'status' => FALSE,
            'message' => 'No data were found'
        ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }

    }

    public function update_question_status_post() {

        $this->common_model->update_entry( 
            'forum_questions', 
            array('status' => $this->input->post('status')), // set data
            array('question_id' => $this->input->post('question_id')) // where
          );

        if ($this->db->trans_status() === FALSE)
        {
            // generate an error... or use the log_message() function to log your error
            // Set the response and exit
            $this->response([
                'status'  => FALSE,
                'message' => 'Unable to update question status'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        } else {


          // allocate points to author on question publish 
          if ($this->input->post('status') == 1) {
            
            $this->update_question_points($this->input->post('question_id'), $this->input->post('author_id'));
          }

          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'message'   => 'Question status updated',
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        }
    }

    public function delete_question_post() {

        $this->common_model->delete_entry(  'forum_questions', array('question_id' => $this->input->post('question_id')) );

        if ($this->db->affected_rows())
        {
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'message'   => 'Question deleted',
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {

          // generate an error... or use the log_message() function to log your error
          // Set the response and exit
          $this->response([
              'status'  => FALSE,
              'message' => 'Unable to delete question'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
    }

    public function update_answer_status_post() {

        $this->common_model->update_entry( 
            'forum_answers', 
            array('status' => $this->input->post('status')), // set data
            array('answer_id' => $this->input->post('answer_id')) // where
          );

        if ($this->db->trans_status() === FALSE)
        {
            // generate an error... or use the log_message() function to log your error
            // Set the response and exit
            $this->response([
                'status'  => FALSE,
                'message' => 'Unable to update answer status'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        } else {


          // allocate points to author on question publish 
          if ($this->input->post('status') == 1) {
            
            $this->update_answer_points($this->input->post('answer_id'), $this->input->post('author_id'));
          }

          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'message'   => 'Answer status updated',
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        }
    }

    public function delete_answer_post() {

        $this->common_model->delete_entry(  'forum_answers', array('answer_id' => $this->input->post('answer_id')) );

        if ($this->db->affected_rows())
        {
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'message'   => 'Answer deleted',
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {

          // generate an error... or use the log_message() function to log your error
          // Set the response and exit
          $this->response([
              'status'  => FALSE,
              'message' => 'Unable to delete answer'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
    }

    public function get_story_get($story_id)
    { 
     
        $story = $this->admin_model->get_story( array('story_id' => $story_id) );

        // Check if the story data store contains story (in case the database result returns NULL)
        if ( !empty($story) ) {

            $story[0]->description = html_entity_decode($story[0]->description);
            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data'   => $story[0],
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {

            // Set the response and exit
            $this->response([
                'status'  => FALSE,
                'message' => 'No story were found'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
    }

    public function get_comments_get($status)
    { 
     
        $comments = $this->admin_model->get_comments( array('approved' => $status) );

        // Check if the story data store contains story (in case the database result returns NULL)
        if ( !empty($comments) ) {

            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data'   => $comments,
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {

            // Set the response and exit
            $this->response([
                'status'  => FALSE,
                'message' => 'No comments were found'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
    }

    public function update_comment_status_post()
    { 
        $this->common_model->update_entry( 
            'comments', 
            array('approved' => $this->input->post('status')), // set data
            array('comment_id' => $this->input->post('comment_id')) // where
          );

        if ($this->db->trans_status() === FALSE)
        {
            // generate an error... or use the log_message() function to log your error
            // Set the response and exit
            $this->response([
                'status'  => FALSE,
                'message' => 'Unable to update comment status'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        } else {

          // update points on comment approval
          if ( $this->input->post('status') == 1 ) {
            
            $comment = $this->common_model->get_data( 
              'comments', 
              array('comment_id' => $this->input->post('comment_id'))
            );

            $this->verify_comments_points($comment[0]->story_id);
          }

          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'message'   => 'Comment status updated',
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        }
    }

    public function delete_comment_post()
    { 
        $this->common_model->delete_entry(  'comments', array('comment_id' => $this->input->post('comment_id')) );

        if ($this->db->affected_rows())
        {
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'message'   => 'Comment deleted',
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {

          // generate an error... or use the log_message() function to log your error
          // Set the response and exit
          $this->response([
              'status'  => FALSE,
              'message' => 'Unable to delete comment'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
    }

    public function get_forum_comments_get($status)
    { 
     
        $comments = $this->admin_model->get_forum_comments( array('approved' => $status) );

        // Check if the story data store contains story (in case the database result returns NULL)
        if ( !empty($comments) ) {

            foreach ($comments as $comment) {
              
              $comment->answer = html_entity_decode($comment->answer);
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
                'status'  => FALSE,
                'message' => 'No comments were found'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
    }

    public function update_forum_comment_status_post()
    { 
        $this->common_model->update_entry( 
            'forum_answer_comments', 
            array('approved' => $this->input->post('status')), // set data
            array('comment_id' => $this->input->post('comment_id')) // where
          );

        if ($this->db->trans_status() === FALSE)
        {
            // generate an error... or use the log_message() function to log your error
            // Set the response and exit
            $this->response([
                'status'  => FALSE,
                'message' => 'Unable to update comment status'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        } else {

          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'message'   => 'Comment status updated',
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        }
    }

    public function delete_forum_comment_post()
    { 
        $this->common_model->delete_entry(  'forum_answer_comments', array('comment_id' => $this->input->post('comment_id')) );

        if ($this->db->affected_rows())
        {
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'message'   => 'Comment deleted',
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {

          // generate an error... or use the log_message() function to log your error
          // Set the response and exit
          $this->response([
              'status'  => FALSE,
              'message' => 'Unable to delete comment'
          ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
    }

    public function update_featured_get($story_id)
    { 

        if ( $this->db->query("UPDATE stories SET featured = IF(featured=1, 0, 1) where story_id = ".$story_id) ) {

            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data'   => 'featured_updated',
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code

        } else {

            // Set the response and exit
            $this->response([
                'status'  => FALSE,
                'message' => 'unable to update featured'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }


    }


    public function update_story_status_post()
    { 
      
        $data = array('review' => $this->input->post('review'), 'status' => $this->input->post('review'));
        $where = array('story_id' => $this->input->post('story_id'));

        // Check if the story data store contains story (in case the database result returns NULL)
        if ( $this->common_model->update_entry( 'stories', $data, $where ) ) {

            // allocate points to author on story publish 
            if ($this->input->post('review') == STORY_STATUS_PUBLISHED) {
              
              $this->update_story_points($this->input->post('story_id'), $this->input->post('author_id'));
            }

            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data'   => 'status updated',
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {

            // Set the response and exit
            $this->response([
                'status'  => FALSE,
                'message' => 'Unable to update status'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }

    }


    public function get_parent_categories_get($cat_id)
    { 
        $categories = $this->common_model->get_parent_categories($cat_id);

        // Check if the categories data store contains categories (in case the database result returns NULL)
        if ( !empty($categories) ) {

            // Set the response and exit
            $this->response(  
              array(
                'status' => TRUE,
                'data' => $categories,
              ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No categories were found'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }


    }

    public function get_user_info_get($user_id) {

      $user = $this->user_model->get_user_info( array('users.user_id' => $user_id) );

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


    public function get_user_points_get($user_id) {

      $points = $this->user_model->get_user_points( $user_id );

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

    public function get_user_stories_get($user_id) {

      $stories = $this->common_model->get_stories( 
        array(
          'stories.status'    => STORY_STATUS_PUBLISHED, 
          'stories.author_id' => $user_id
        )
      );

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
                'message' => 'No data was found',
                'error' => array('No data was found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }


    public function update_user_status_post() {

      $updated = $this->common_model->update_entry( 'users',
        array( 'status'    => $this->input->post('status') ),
        array( 'user_id' => $this->input->post('user_id') )
      );

      if ( !empty($updated) ) {
          
          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => 'status_upadted',
            ), REST_Controller::HTTP_OK); // OK (200) being the HTTP response code        
      } else {

            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'Unable to update status',
                'error' => array('No data was found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }


    public function get_flagged_stories_get() {

      $stories = $this->admin_model->get_flagged_stories();

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
                'message' => 'No data was found',
                'error' => array('No data was found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }

    public function get_flagged_answers_get() {

      $answers = $this->admin_model->get_flagged_answers();

      if ( !empty($answers) ) {
          
                  
          foreach ($answers as $answer) {
            
            $answer->answer    = is_null($answer->subject) ? null : html_entity_decode($answer->subject);

            // get in time ago format
            $answer->answered_ago = time_elapsed_string($answer->created);
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
                'message' => 'No data was found',
                'error' => array('No data was found'),
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
      }
    }


    public function get_flagged_comments_get() {

      $comments = $this->admin_model->get_flagged_comments();
      
      if ( !empty($comments) ) {
          
          foreach ($comments as $comment) {
            
            $comment->answer = html_entity_decode($comment->answer);
          }

          // Set the response and exit
          $this->response(  
            array(
              'status' => TRUE,
              'data' => $comments,
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

  private function verify_comments_points($story_id) {

    $comments_count = $this->common_model->data_exists( 'comments', array('story_id' => $story_id, 'approved' => 1) );

    $points = 0;

    if ( $comments_count == 10 ) {
      $points = POINTS_FOR_10_COMMENTS;
    } else if ( $comments_count == 20 ) {
      
      $points = POINTS_FOR_20_COMMENTS;
    } else if ( $comments_count == 30 ) {
      
      $points = POINTS_FOR_30_COMMENTS;
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
        'milestone' => $comments_count,
        'activity'  => 'comments',
        'selector'  => 'story',
        'selector_id'  => $story_id,
        'total_points' => $user_points->points,
      );

      // insert points allocation log
      $this->common_model->insert_entry('points_allocation', $points_data);
    }

  } 

  private function update_story_points($story_id, $user_id) {

    $points = STORY_PUBLISH_POINTS;

    if ( $points > 0 ) {
      
      // update and get total points of user
      $user_points = $this->common_model->update_user_points($user_id, $points);

      // points allocation data
      $points_data = array(
        'user_id'   => $user_id,
        'points'    => $points,
        'milestone' => 1,
        'activity'  => 'approved',
        'selector'  => 'story',
        'selector_id'  => $story_id,
        'total_points' => $user_points->points,
      );

      // insert points allocation log
      $this->common_model->insert_entry('points_allocation', $points_data);
    }
  } 

  private function update_question_points($question_id, $user_id) {

    $points = QUESTION_PUBLISH_POINTS;

    if ( $points > 0 ) {
      
      // update and get total points of user
      $user_points = $this->common_model->update_user_points($user_id, $points);

      // points allocation data
      $points_data = array(
        'user_id'   => $user_id,
        'points'    => $points,
        'milestone' => 1,
        'activity'  => 'approved',
        'selector'  => 'question',
        'selector_id'  => $question_id,
        'total_points' => $user_points->points,
      );

      // insert points allocation log
      $this->common_model->insert_entry('points_allocation', $points_data);
    }
  }
  
  private function update_answer_points($answer_id, $user_id) {

    $points = ANSWER_PUBLISH_POINTS;

    if ( $points > 0 ) {
      
      // update and get total points of user
      $user_points = $this->common_model->update_user_points($user_id, $points);

      // points allocation data
      $points_data = array(
        'user_id'   => $user_id,
        'points'    => $points,
        'milestone' => 1,
        'activity'  => 'approved',
        'selector'  => 'answer',
        'selector_id'  => $answer_id,
        'total_points' => $user_points->points,
      );

      // insert points allocation log
      $this->common_model->insert_entry('points_allocation', $points_data);
    }
  } 

}
