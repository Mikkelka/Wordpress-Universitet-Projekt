<?php 

// https://developer.wordpress.org/resource/dashicons/#admin-plugins (icons)
// https://developer.wordpress.org/reference/functions/register_post_type/
function university_post_types() {

  // Campus post type
  register_post_type('campus', array(
    'show_in_rest' => true, // show in modern Block Editor screen
    "supports" => array("title", "editor", "excerpt"),
    "capability_type" => "campus",
    'map_meta_cap' => true,
    "rewrite" => array("slug" => "Campuses"),
    'has_archive' => true,
    'public' => true,
    'labels' => array(
      'name' => 'Campuses',
      'add_new_item' => 'Add New Campus',
      'edit_item' => 'Edit Campus',
      'all_items' => 'All Campuses',
      'singular_name' => 'Campus'
    ),
    'menu_icon' => 'dashicons-location-alt'
  ));

  // AIzaSyCksCYVH2kYTSYgjOvLIE0MZVj2JpKhK44


  // Event post type
  register_post_type('event', array(
    'show_in_rest' => true, // show in modern Block Editor screen
    "capability_type" => "event",
    'map_meta_cap' => true,
    "supports" => array("title", "editor", "excerpt"),
    "rewrite" => array("slug" => "events"),
    'has_archive' => true,
    'public' => true,
    'labels' => array(
      'name' => 'Events',
      'add_new_item' => 'Add New Event',
      'edit_item' => 'Edit Event',
      'all_items' => 'All Events',
      'singular_name' => 'Event'
    ),
    'menu_icon' => 'dashicons-calendar'
  ));

  // Program post type
  register_post_type('program', array(
    'show_in_rest' => true, // show in modern Block Editor screen
    "supports" => array("title"),
    "rewrite" => array("slug" => "programs"),
    'has_archive' => true,
    'public' => true,
    'labels' => array(
      'name' => 'Programs',
      'add_new_item' => 'Add New Program',
      'edit_item' => 'Edit Program',
      'all_items' => 'All Programs',
      'singular_name' => 'Program'
    ),
    'menu_icon' => 'dashicons-awards'
  ));

  // professor post type
  register_post_type('professor', array(
    'show_in_rest' => true, // show in modern Block Editor screen
    "supports" => array("title", "editor", "thumbnail"),
    'public' => true,
    'labels' => array(
      'name' => 'Professors',
      'add_new_item' => 'Add New professor',
      'edit_item' => 'Edit professor',
      'all_items' => 'All professors',
      'singular_name' => 'professor'
    ),
    'menu_icon' => 'dashicons-welcome-learn-more'
  ));

  // note post type
  register_post_type('note', array(
    'show_in_rest' => true, // show in modern Block Editor screen
    "supports" => array("title", "editor"),
    'public' => false,
    'show_ui' => true,
    'labels' => array(
      'name' => 'Notes',
      'add_new_item' => 'Add New note',
      'edit_item' => 'Edit note',
      'all_items' => 'All notes',
      'singular_name' => 'note'
    ),
    'menu_icon' => 'dashicons-welcome-write-blog'
  ));


}
 
add_action('init', 'university_post_types');

?>