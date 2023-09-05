<?php
require get_theme_file_path( '/inc/like-route.php' );
require get_theme_file_path( '/inc/search-route.php' );

// page transitions
function my_theme_scripts() {
  wp_enqueue_script( 'page-transition', get_stylesheet_directory_uri() . '/src/modules/page-transition.js', [], '1.0', true );
}
add_action( 'wp_enqueue_scripts', 'my_theme_scripts' );


function university_custom_rest() {
  register_rest_field( 'post', 'authorName', array(
    'get_callback' => function() {return get_the_author();}
  ));
};

add_action('rest_api_init', "university_custom_rest");


// 
// 
// snippet
function pageBanner($args = Null) {

  if (!isset($args['title'])) {
    $args['title'] = get_the_title(  );
  }

  if (!isset($args['subtitle'])) {
    $args['subtitle'] = get_field('page_banner_subtitle');
  }
  
  if (!isset($args['photo'])) {
    if (get_field('page_banner_background_image') AND !is_archive() AND !is_home() ) {
      $args['photo'] = get_field('page_banner_background_image')['sizes']['pageBanner'];
    } else {
      $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
    }
  }

?>

<div class="page-banner">
  <div class="page-banner__bg-image" style="background-image: url(<?php echo $args["photo"] ?>)">
  </div>
  <div class="page-banner__content container container--narrow">
    <h1 class="page-banner__title"><?php echo $args["title"] ?></h1>
    <div class="page-banner__intro">
      <p>
        <?php echo $args["subtitle"] ?>
      </p>
    </div>
  </div>
</div>

<?php 
}

// snippet end
// 
// 



function university_files()
{
  // Enqueue the main JS file with dependencies and in the footer
  wp_enqueue_script('googleMap', '//maps.googleapis.com/maps/api/js?key=AIzaSyCksCYVH2kYTSYgjOvLIE0MZVj2JpKhK44', NULL, '1.0', true);
  wp_enqueue_script('main-university-js', get_theme_file_uri('/build/index.js'), array('jquery'), '1.0', true);

  // Enqueue a custom Google font stylesheet
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');

  // Enqueue Font Awesome and custom CSS stylesheets
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
  wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));

  wp_localize_script( 'main-university-js' , 'universityData', array(
   'root_url' => get_site_url(), 
   'nonce' => wp_create_nonce('wp_rest')
  ));
}

function university_features() {
  // Register navigation menus
  register_nav_menu("headerMenuLocation", "Header Menu Loaction" );
  register_nav_menu("footerLocationOne", "Footer Location One" );
  register_nav_menu("footerLocationTwo", "Footer Location Two" );

  // Enable title tag support
  add_theme_support("title-tag");

  // Enable post thumbnails
  add_theme_support( "post-thumbnails" );

  // Add custom image sizes
  add_image_size('professorLandscape', 400, 260, true);
  add_image_size('professorPortrait', 480, 650, true);
  add_image_size('pageBanner', 1500, 350, true);

  // Add editor styles
  add_theme_support('editor-styles');
  add_editor_style( array( 
    'https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i',
    'build/style-index.css',
    'build/index.css'
  ));
}

// Enqueue styles and scripts when the theme is loaded
add_action('wp_enqueue_scripts', 'university_files');
// Register menus and title tag support after the theme setup is complete
add_action("after_setup_theme", "university_features");


// 
// 
// Modify event queries to only show future events, sorted by date
function university_adjust_queries($query) {

  if(!is_admin() AND is_post_type_archive( "campus" ) AND $query->is_main_query()) {
    $query->set("post_per_page", -1);
  };

  if(!is_admin() AND is_post_type_archive( "program" ) AND $query->is_main_query()) {
    $query->set('orderby', 'title');
    $query->set('order', 'ASC');
    $query->set("posts_per_page", -1);
  };

  if (!is_admin() AND is_post_type_archive( "event" ) AND $query->is_main_query()) {
    $today = date("Ymd");
    $query->set("meta_key", "event_date");
    $query->set('orderby', 'meta_value_num');
    $query->set('order', 'ASC');
    $query->set("meta_query", array( 
      array(
        "key" => "event_date", 
        "compare" => ">=", 
        "value" => $today, 
        "type" => "numeric"
      ),
    ));
  }
}


// Hook into the pre_get_posts action to modify event queries
add_action("pre_get_posts", "university_adjust_queries");


function googleMapKey($api) {
  $api["key"] = "AIzaSyCksCYVH2kYTSYgjOvLIE0MZVj2JpKhK44";
  return $api;
};

add_filter("acf/fields/google_map/api", "googleMapKey");


// 
// 
// Redirects subscribers to the front page upon login.
function redirecSubsToFrontpage() {
  // Get the current logged-in user.
  $ourCurrentUser = wp_get_current_user();

  // Check if the user has only one role and it is a subscriber.
  if (count($ourCurrentUser->roles) == 1 && $ourCurrentUser->roles[0] == "subscriber") { 
    // Redirect the user to the front page.
    wp_redirect(get_site_url());
    exit;
  }
}
// Add an action to run the function when the admin initializes.
add_action('admin_init' , 'redirecSubsToFrontpage');


// 
// 
// Removes the admin bar for subscribers.
function noSubsAdminBar() {
  // Get the current logged-in user.
  $ourCurrentUser = wp_get_current_user();

  // Check if the user has only one role and it is a subscriber.
  if (count($ourCurrentUser->roles) == 1 && $ourCurrentUser->roles[0] == "subscriber") { 
    // Disable the admin bar for the user.
    show_admin_bar(false);
  }
}
// Add an action to run the function when WordPress has finished loading.
add_action('wp_loaded' , 'noSubsAdminBar');


// 
// 
// Customize Login Screen
add_filter("login_headerurl", "ourheaderUrl");

function ourheaderUrl($url) {
  return esc_url(get_site_url('/'));
}

add_action('login_enqueue_scripts', 'ourloginCSS');

function ourloginCSS() {
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
  wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));
}

add_filter("login_headertitle", "ourLoginTitle");

function ourLoginTitle($title) {
  return esc_html(get_bloginfo('name'));
}

// 
// 
// force note posts to be private 2
add_filter('wp_insert_post_data', "makeNotePrivate", 10, 2);


function makeNotePrivate($data, $postarr) {
  if ($data['post_type'] == 'note') {
    if(count_user_posts(get_current_user_id(), 'note') > 4 AND !$postarr['ID']) {
      die("You have reached your note limit.");
    }

    $data['post_content'] = sanitize_textarea_field($data['post_content']);
    $data['post_title'] = sanitize_text_field($data['post_title']);
  }

  if($data['post_type'] == 'note' AND $data['post_status'] != 'trash') {
    $data['post_status'] = "private";
  }
  
  return $data;
}


// 
// 
// custom blocks

// function bannerBlock () {
//   wp_register_script('bannerBlockScript', get_stylesheet_directory_uri() . '/build/banner.js', array('wp-blocks', "wp-editor" ));
//   register_block_type('fictional-blocks/banner', array(
//     "editor_script" => "bannerBlockScript"
//   ));
// }

// add_action("init", "bannerBlock");

class PlaceholderBlock {
  function __construct($name) {
    $this->name = $name;
    
    add_action("init", [$this, 'onInit']);
  }

  function ourRenderCallback($attributes, $content) {
    ob_start(); // start the output buffer
    require get_theme_file_path( "/our-blocks/{$this->name}.php" );
    return ob_get_clean(); // end the output buffer
  }

  function onInit() {
    // Register the script with a unique handle, specifying the path to the script file and its dependencies
    wp_register_script( $this->name , get_stylesheet_directory_uri() . "/our-blocks/{$this->name}.js", array('wp-blocks', "wp-editor" ));

    // Define the arguments for registering the block type
    $ourArgs = array(
      "editor_script" => $this->name,
      "render_callback" => [$this, "ourRenderCallback"],
    );

    // Register the block type with a unique name and the defined arguments
    register_block_type("fictional-blocks/{$this->name}", $ourArgs );
  }
}

new PlaceholderBlock("eventsandblogs");
new PlaceholderBlock("header");
new PlaceholderBlock("footer");
new PlaceholderBlock("single");


// 
// 
class JSXBlock {
  function __construct($name, $renderCallback = null, $data = null) {
    $this->name = $name;
    $this->data = $data;
    $this->renderCallback = $renderCallback;
    add_action("init", [$this, 'onInit']);
  }

  function ourRenderCallback($attributes, $content) {
    ob_start(); // start the output buffer
    require get_theme_file_path( "/our-blocks/{$this->name}.php" );
    return ob_get_clean(); // end the output buffer
  }

  function onInit() {
    // Register the script with a unique handle, specifying the path to the script file and its dependencies
    wp_register_script( $this->name , get_stylesheet_directory_uri() . "/build/{$this->name}.js", array('wp-blocks', "wp-editor" ));

    // If data is available, localize the script with the same handle, making the data accessible in the script
    if($this->data) {
      wp_localize_script($this->name, $this->name, $this->data);
    }

    // Define the arguments for registering the block type
    $ourArgs = array(
      "editor_script" => $this->name
    );

    // If the renderCallback property is true, add the "render_callback" argument to the arguments array
    if ($this->renderCallback) {
      $ourArgs["render_callback"] = [$this, "ourRenderCallback"];
    }

    // Register the block type with a unique name and the defined arguments
    register_block_type("fictional-blocks/{$this->name}", $ourArgs );
  }
} 




new JSXBlock('banner', true, ['fallbackimage' => get_theme_file_uri('/images/library-hero.jpg')]); 
new JSXBlock('genericheading');
new JSXBlock('genericbutton');
new JSXBlock('slideshow', true);
new JSXBlock('slide', true, ['themeimagepath' => get_theme_file_uri('/images/')]); 
