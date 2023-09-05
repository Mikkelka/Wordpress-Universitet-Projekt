<?php
  while(have_posts()) {
    the_post(); 

    // snippet
    pageBanner();
?>



<div class="container container--narrow page-section">
  <div class="metabox metabox--position-up metabox--with-home-link">
    <p>
      <a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link("program") ?>">
        <i class="fa fa-home" aria-hidden="true"></i>
        All Programs
      </a>
      <span class="metabox__main">
        <?php the_title() ?>
      </span>
    </p>
  </div>

  <div class="generic-content">
    <?php the_field("main_body_content_") ?>
  </div>

  <!-- professor POST TYPE-->
  <?php 
      $professors = array(
        'post_type' => 'professor', 
        'posts_per_page' => -1, 
        'orderby' => 'title', 
        'order' => 'ASC', 
        "meta_query" => array( 
          array(
            "key" => "related_programs", 
            "compare" => "LIKE", 
            "value" => '"' . get_the_ID() . '"', 
          )
        )
      );

    $relatedprofessorss = new WP_Query($professors);
      
    if($relatedprofessorss->have_posts()) {

    echo '<hr class="section-break">';
    echo '<h2 class="headline headline--medium" > ' . get_the_title() . ' Professors </h2>';

    echo '<ul class="professor-cards">';
    while($relatedprofessorss->have_posts()) {
      $relatedprofessorss->the_post();
    ?>

  <li class="professor-card__list-item">
    <a class="professor-card" href="<?php the_permalink() ?>">
      <img class="professor-card__image" src="<?php the_post_thumbnail_url("professorLandscape") ?>" alt="">
      <span class="professor-card__name">
        <?php the_title() ?>
      </span>
    </a>
  </li>

  <?php 
    };
    echo '</ul>';
  }

      // homepageEvents POST TYPE
      //! Fix $homepageEvents problem with ID 
      wp_reset_postdata();

      $today = date("Ymd"); 
      $events = array(
        'post_type' => 'event', 
        'posts_per_page' => 2,
        "meta_key" => "event_date", 
        'orderby' => 'meta_value_num', 
        'order' => 'ASC', 
        "meta_query" => array( 
          array(
            "key" => "event_date", 
            "compare" => ">=", 
            "value" => $today, 
            "type" => "numeric" 
          ),
          array(
            "key" => "related_programs", 
            "compare" => "LIKE", 
            "value" => '"' . get_the_ID() . '"', 
          )
        )
      );

    $homepageEvents = new WP_Query($events);
      
    if($homepageEvents->have_posts()) {

    echo '<hr class="section-break">';
    echo '<h2 class="headline headline--medium" >Upcoming ' . get_the_title() . ' Events </h2>';

    while($homepageEvents->have_posts()) {
      $homepageEvents->the_post();
  
      // snippet from template-parts folder
      get_template_part("template-parts/content-event");
      
    };
    }


    // new post type
    wp_reset_postdata();
    $relatedCampuses = get_field("related_campus");

    if($relatedCampuses) {
      echo "<hr class='section-break'>";
      echo '<h2 class="headline headline--medium">' . get_the_title() . ' is Available At These Campuses:</h2>';

      echo '<ul class="min-list link-list">';
      foreach($relatedCampuses as $campus) { 
      ?>
  <li> <a href="<?php echo the_permalink($campus) ?>"> <?php echo get_the_title($campus) ?> </a> </li>
  <?php
      };
      echo '</ul>';
    }
  ?>

</div>


<?php }
 