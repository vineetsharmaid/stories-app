<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		$this->load->view('welcome_message');
	}

	public function email_confirm()
	{
	
		$usermeta = $this->db->get_where('usermeta', array('meta_key' => 'confirm_email_code', 'meta_value' => $_GET['q']))->row();
		
		if ( isset($usermeta->user_id) ) {
		
			$user_company = $this->db->get_where('usermeta', array('meta_key' => 'confirm_company', 'user_id' => $usermeta->user_id))->row();
			
			$this->common_model->update_entry('users', 
				array('company_id' => $user_company->meta_value), 
				array('user_id' => $usermeta->user_id));
			
			$this->db->where(array('meta_key' => 'confirm_email_code', 'meta_value' => $_GET['q']));
			$this->db->delete('usermeta');

			$this->db->where(array('meta_key' => 'confirm_company', 'user_id' => $usermeta->user_id));
			$this->db->delete('usermeta');

			$this->load->view('email_confirmed');
		} else {
		
			redirect(APP_URL, 'refresh');
		}
		
	}

	public function account_verify()
	{
	
		$usermeta = $this->db->get_where('usermeta', array('meta_key' => 'verify_account_code', 'meta_value' => $_GET['q']))->row();
		
		if ( isset($usermeta->user_id) ) {
		
			$this->common_model->update_entry('users', 
				array('status' => 1), 
				array('user_id' => $usermeta->user_id));
			
			$this->db->where(array('meta_key' => 'verify_account_code', 'meta_value' => $_GET['q']));
			$this->db->delete('usermeta');

			$this->load->view('account_confirmed');
		} else {
		
			redirect(APP_URL, 'refresh');
		}
		
	}
}
