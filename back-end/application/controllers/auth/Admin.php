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