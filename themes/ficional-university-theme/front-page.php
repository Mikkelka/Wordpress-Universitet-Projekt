<?php get_header();
?>

<div class="page-banner">
  <div class="page-banner__bg-image"
    style="background-image: url(<?php echo get_theme_file_uri('/images/library-hero.jpg') ?>);"></div>
  <div class="page-banner__content container t-center c-white">
    <h1 class="headline headline--large">Welcome!</h1>
    <h2 class="headline headline--medium">We think you&rsquo;ll like it here.</h2>
    <h3 class="headline headline--small">Why don&rsquo;t you check out the <strong>major</strong> you&rsquo;rephpfmt
      interested in?</h3>
    <a href="<?php echo get_post_type_archive_link("program") ?>" class="btn btn--large btn--blue">Find Your Major</a>
  </div>
</div>

<!--  -->

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

<!--  -->

<!-- <div class="hero-slider">
  <div data-glide-el="track" class="glide__track">
    <div class="glide__slides">
      <div class="hero-slider__slide"
        style="background-image: url(<?php echo get_theme_file_uri('/images/bus.jpg') ?>);">
        <div class="hero-slider__interior container">
          <div class="hero-slider__overlay">
            <h2 class="headline headline--medium t-center">Free Transportation</h2>
            <p class="t-center">All students have free unlimited bus fare.</p>
            <p class="t-center no-margin"><a href="#" class="btn btn--blue">Learn more</a></p>
          </div>
        </div>
      </div>
      <div class="hero-slider__slide"
        style="background-image: url(<?php echo get_theme_file_uri('/images/apples.jpg') ?>);">
        <div class="hero-slider__interior container">
          <div class="hero-slider__overlay">
            <h2 class="headline headline--medium t-center">An Apple a Day</h2>
            <p class="t-center">Our dentistry program recommends eating apples.</p>
            <p class="t-center no-margin"><a href="#" class="btn btn--blue">Learn more</a></p>
          </div>
        </div>
      </div>
      <div class="hero-slider__slide"
        style="background-image: url(<?php echo get_theme_file_uri('/images/bread.jpg') ?>);">
        <div class="hero-slider__interior container">
          <div class="hero-slider__overlay">
            <h2 class="headline headline--medium t-center">Free Food</h2>
            <p class="t-center">Fictional University offers lunch plans for those in need.</p>
            <p class="t-center no-margin"><a href="#" class="btn btn--blue">Learn more</a></p>
          </div>
        </div>
      </div>
    </div>
    <div class="slider__bullets glide__bullets" data-glide-el="controls[nav]"></div>
  </div>
</div> -->


<div class="hero-slider">
  <div data-glide-el="track" class="glide__track">
    <div class="glide__slides">

    <?php 

    // slides post type 
    $args = array(
      'post_type' => 'slides',
      'posts_per_page' => -1
    );

    $slideshowSlides = new WP_Query($args);

    while($slideshowSlides->have_posts()) {
      $slideshowSlides->the_post();
    ?>

      <!--  -->
      <div class="hero-slider__slide"
        style="background-image: url(<?php the_post_thumbnail_url() ?>);">
        <div class="hero-slider__interior container">
          <div class="hero-slider__overlay">
            <h2 class="headline headline--medium t-center"><?php the_title() ?></h2>
            <p class="t-center"><?php the_content() ?></p>
            <p class="t-center no-margin"><a href="#" class="btn btn--blue">Learn more</a></p>
          </div>
        </div>
      </div>

      <?php 
      }
        wp_reset_postdata(); 
      ?>

      <!--  -->
    </div>
    <div class="slider__bullets glide__bullets" data-glide-el="controls[nav]"></div>
  </div>
</div> 



<?php get_footer();

?>