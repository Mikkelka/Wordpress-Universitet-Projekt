<!-- This is what we see in the browser ( real page ) -->

<div class="full-width-split group">
  <div class="full-width-split__one">
    <div class="full-width-split__inner">
      <h2 class="headline headline--small-plus t-center">Upcoming Events</h2>

      <?php 
        // Set today's date in the Ymd format
        $today = date("Ymd");
        // Create an array of events with the following parameters
        $events = array(
          'post_type' => 'event', // The post type is event
          'posts_per_page' => 2, // Show all posts of the event type
          "meta_key" => "event_date", // Sort by the meta key "event_date"
          'orderby' => 'meta_value_num', // Order by the numeric value of the meta key
          'order' => 'ASC', // Order the results in ascending order
          "meta_query" => array( // Add a meta query to filter the results
            array(
              "key" => "event_date", // Filter by the meta key "event_date"
              "compare" => ">=", // Only show events that are greater than or equal to today's date
              "value" => $today, // Set the value to today's date
              "type" => "numeric" // Set the type to numeric
            ),
          )
        );
      
      
      $homepageEvents = new WP_Query($events);

      while($homepageEvents->have_posts()) {
        $homepageEvents->the_post();
      
        // snippet from template-parts folder
        get_template_part("template-parts/content", "event");

      };
      ?>

      <p class="t-center no-margin"><a href="<?php echo get_post_type_archive_link("event") ?>"
          class="btn btn--blue">View
          All Events</a></p>

    </div>
  </div>

  <!--  -->

  <div class="full-width-split__two">
    <div class="full-width-split__inner">
      <h2 class="headline headline--small-plus t-center">From Our Blogs</h2>

      <?php 

        $args = array(
          'post_type' => 'post',
          'posts_per_page' => 2,
          'orderby' => 'date',
          'order' => 'DESC',
        );

        $homepagePosts = new WP_Query($args);

        while($homepagePosts->have_posts()) {
          $homepagePosts->the_post(); 
      ?>

      <div class="event-summary">
        <a class="event-summary__date event-summary__date--beige t-center" href="<?php the_permalink( ) ?>">
          <span class="event-summary__month"><?php the_time( 'M' ) ?></span>
          <span class="event-summary__day"><?php the_time( 'd' ) ?></span>
        </a>
        <div class="event-summary__content">
          <h5 class="event-summary__title headline headline--tiny"><a
              href="<?php the_permalink( ) ?>"><?php the_title() ?></a></h5>
          <p>
            <?php if(has_excerpt()) {
                // the_excerpt(); or 
                echo get_the_excerpt();
            } else {
              echo wp_trim_words(get_the_content(), 18 );
            } ?>
            <a href="<?php the_permalink( ) ?>" class="nu gray">Read more</a>
          </p>
        </div>
      </div>

      <?php       
          } wp_reset_postdata();
      ?>

      <p class="t-center no-margin"><a href="<?php echo site_url("/blog") ?>" class="btn btn--yellow">View All Blog
          Posts</a></p>
    </div>
  </div>
</div>