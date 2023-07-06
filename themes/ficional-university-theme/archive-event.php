<?php 
get_header();

// snippet
pageBanner(array(
  "title" => "All Events",
  "subtitle" => "See that is going on in our world."
));
?>

<div class="container container--narrow page-section">
  <?php 
    while(have_posts()) {
      the_post();
      
      // snippet from template-parts folder
      get_template_part("template-parts/content-event");
    }

    echo paginate_links( )
  ?>


  <hr class="section-break">

  <p>Looking for a recap of past events? <a href="<?php echo site_url("/past-events") ?>">Check out our past ecents
      archive</a> </p>

</div>


<?php
get_footer();
?>