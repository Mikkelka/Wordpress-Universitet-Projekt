<?php

add_action('rest_api_init', "universityLikeRoutes");

function universityLikeRoutes() {
    register_rest_route('university/v1', 'manageLike', array(
        'methods' => 'POST',
        'callback' => 'createLike'
    ));

    register_rest_route('university/v1', 'manageLike', array(
        'methods' => 'DELETE',
        'callback' => 'deleteLike'
    ));
};


// 

function createLike($data) {
    // Check if the user is logged in
    if (is_user_logged_in()) {
        // Sanitize the professor ID from the input data
        $professor = sanitize_text_field($data['professorId']); 

        // Query to check if the user has already liked the professor
        $existQuery = new WP_Query(array(
            'author' => get_current_user_id(),
            'post_type' => 'like',
            'meta_query' => array(
                array(
                    'key' => 'liked_professor_id',
                    'compare' => '=',
                    'value' => $professor
                )
            )
        ));

        // Check if the like does not already exist and the professor ID is valid
        if ($existQuery->found_posts == 0 && get_post_type($professor) == 'professor') {
            // Insert a new like post
            return wp_insert_post(array(
                'post_type' => 'like',
                'post_status' => 'publish',
                'post_title' => "2nd test",
                'meta_input' => array(
                    'liked_professor_id' => $professor,
                )
            ));
        } else {
            // Invalid professor ID
            die('Invalid professor ID.');
        }
    } else {
        // User must be logged in to like a post
        die('You must be logged in to like a post.');
    }
}

function deleteLike( $data ) {
    $likeId = sanitize_text_field($data['like']);

    if (get_current_user_id()  == get_post_field('post_author', $likeId) AND get_post_type($likeId) == 'like') {
        wp_delete_post($likeId, true);

        return "Like deleted.";
    } else {
        die('You must be logged in to like a post.');
    }
    
}