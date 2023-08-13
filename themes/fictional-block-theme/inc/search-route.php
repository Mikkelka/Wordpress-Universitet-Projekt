<?php 

// // Hook our function to the rest_api_init action
// add_action('rest_api_init', 'universityRegisterSearch');

// // Function to register our custom REST API route
// function universityRegisterSearch() {
//   register_rest_route('university/v1', 'search', array(
//     'methods' => WP_REST_Server::READABLE,  // Use constant for readability, equivalent to 'GET'
//     'callback' => 'universitySearchResults' // The function to run when this endpoint is hit
//   ));
// }

// // Function to handle the custom search logic
// function universitySearchResults($data) {
//   // Create a new WP_Query with post types and search term
//  $mainQuery = new WP_Query(array(
//   'posts_per_page' => -1,
//   'post_type' => array('post', 'page', 'professor', 'program', 'campus', 'event' ),
//   's' => sanitize_text_field($data['term']) // Sanitize search term for security
//  ));

//  // Initialize an array for storing our search results
//  $results = array(
//   'generalInfo' => array(),
//   'professors' => array(),
//   'programs' => array(),
//   'events' => array(),
//   'campuses' => array(),
//  );

//  // Loop over the posts in the query
//  while($mainQuery->have_posts()) {
//     $mainQuery->the_post();
    
//     // Get the post type of the current post
//     $post_type = get_post_type();
//     // Define array of possible post types
//     $types = array('post', 'page', 'professor', 'program', 'campus', 'event');

    
//     // Check if the post type is in our array of types
//     if (in_array($post_type, $types)) {
//         // Set the typeKey to be used in the results array, use 'generalInfo' for 'post' and 'page'
//         if ($post_type == 'post' || $post_type == 'page') {
//             $typeKey = 'generalInfo';
//         } else if ($post_type == 'professor') {
//             $typeKey = 'professors';
//         } else if ($post_type == 'campus') {
//             $typeKey = 'campuses';
//         } else {
//             // default to using the post type as the key + s
//             $typeKey = $post_type.'s';
//         }
        
//         // Check if the key exists in the results array
//         if (array_key_exists($typeKey, $results)) {
//             // Push the post title and permalink into the results array
//             $eventDate = new DateTime(get_field("event_date"));
//             $description = null;

//             if(has_excerpt()) {
//               $description = get_the_excerpt();
//             } else {
//               $description = wp_trim_words(get_the_content(), 18 );
//             }

//             array_push($results[$typeKey], array(
//                 'title' => get_the_title(),
//                 'permalink' => get_the_permalink(),
//                 'postType' => get_post_type(),
//                 'authorName' => get_the_author(),
//                 'image' => get_the_post_thumbnail_url(0, 'professorLandscape'),
//                 'month' => $eventDate->format("M"),
//                 'day' => $eventDate->format("d"),
//                 'description' => $description,
//             ));
//         } else {
//             // Print an error message
//             error_log("Key '$typeKey' does not exist in the results array.");
//         }
//     }

//  }

//  $programRelationshipQuery = new WP_Query(array(
//   'post_type' => 'professor',
//   'meta_query' => array(
//     array(
//       "key" => "related_programs", 
//       "compare" => "LIKE", 
//       "value" => '"69"', 
//     )
//   )
//  ));

//  while($programRelationshipQuery->have_posts()) {
//     $programRelationshipQuery->the_post();

//     if (get_post_type() == 'professor') {
//       array_push($results['professors'], array(
//         'title' => get_the_title(),
//         'permalink' => get_the_permalink(),
//         'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
//       ));
//     }
    
//  }

//   $uniqueProfessors = array();
//   foreach ($results['professors'] as $professor) {
//       $key = $professor['title'] . '|' . $professor['permalink']; // Add more fields if needed
//       if (!isset($uniqueProfessors[$key])) {
//           $uniqueProfessors[$key] = $professor;
//       }
//   }
//   $results['professors'] = array_values($uniqueProfessors);



//  // Return the results array
//  return $results;
// }



//  other version 

add_action('rest_api_init', 'universityRegisterSearch');

function universityRegisterSearch() {
  register_rest_route('university/v1', 'search', array(
    'methods' => WP_REST_SERVER::READABLE,
    'callback' => 'universitySearchResults'
  ));
}

function universitySearchResults($data) {
  $mainQuery = new WP_Query(array(
    'posts_per_page' => -1,
    'post_type' => array('post', 'page', 'professor', 'program', 'campus', 'event'),
    's' => sanitize_text_field($data['term'])
  ));

  $results = array(
    'generalInfo' => array(),
    'professors' => array(),
    'programs' => array(),
    'events' => array(),
    'campuses' => array()
  );

  while($mainQuery->have_posts()) {
    $mainQuery->the_post();

    if (get_post_type() == 'post' OR get_post_type() == 'page') {
      array_push($results['generalInfo'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'postType' => get_post_type(),
        'authorName' => get_the_author()
      ));
    }

    if (get_post_type() == 'professor') {
      array_push($results['professors'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
      ));
    }

    if (get_post_type() == 'program') {
      $relatedCampuses = get_field('related_campus');

      if ($relatedCampuses) {
        foreach ($relatedCampuses as $campus) {
          array_push($results['campuses'], array(
           'title' => get_the_title($campus),
           'permalink' => get_the_permalink($campus),
          ));
        }
      }

      array_push($results['programs'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'id' => get_the_ID()
      ));
    }

    if (get_post_type() == 'campus') {
      array_push($results['campuses'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    }

    if (get_post_type() == 'event') {
      $eventDate = new DateTime(get_field('event_date'));
      $description = null;
      if (has_excerpt()) {
        $description = get_the_excerpt();
      } else {
        $description = wp_trim_words(get_the_content(), 18);
      }

      array_push($results['events'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'month' => $eventDate->format('M'),
        'day' => $eventDate->format('d'),
        'description' => $description
      ));
    }
    
  }


  if ($results['programs']) {

    $programsMetaQuery = array('relation' => "OR");

    foreach($results['programs'] as $item ) {
      array_push( $programsMetaQuery, array(
        "key" => "related_programs", 
        "compare" => "LIKE", 
        "value" => '"' . $item['id'] . '"', 
      ));
    }

    $programRelationshipQuery = new WP_Query(array(
    'post_type' => array('professor', 'event'),
    'meta_query' => $programsMetaQuery,
  ));

  while($programRelationshipQuery->have_posts()) {
      $programRelationshipQuery->the_post();

      if (get_post_type() == 'professor') {
        array_push($results['professors'], array(
          'title' => get_the_title(),
          'permalink' => get_the_permalink(),
          'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
        ));
      }

      if (get_post_type() == 'event') {
      $eventDate = new DateTime(get_field('event_date'));
      $description = null;
      if (has_excerpt()) {
        $description = get_the_excerpt();
      } else {
        $description = wp_trim_words(get_the_content(), 18);
      }

      array_push($results['events'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'month' => $eventDate->format('M'),
        'day' => $eventDate->format('d'),
        'description' => $description
      ));
    }  
  }

  
    $results['professors'] = array_values(array_unique($results['professors'], SORT_REGULAR));
    $results['events'] = array_values(array_unique($results['events'], SORT_REGULAR));
  }

  return $results;

}