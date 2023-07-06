<?php
get_header();

while (have_posts()) {
  the_post(); 
  
  // snippet 
  pageBanner();
?>

<div class="container container--narrow page-section">

  <?php 

// Get the ID of the current post's parent page (if it exists)
$theParent = wp_get_post_parent_id(get_the_ID());

// Check if the current post has a parent page
if ($theParent) { ?>

  <!-- Display a div element with links to the parent page and the homepage -->
  <div class="metabox metabox--position-up metabox--with-home-link">
    <p>
      <a class="metabox__blog-home-link" href="<?php echo get_permalink($theParent) ?>">
        <i class="fa fa-home" aria-hidden="true"></i>
        Back to <?php echo get_the_title($theParent) ?>
      </a>
      <span class="metabox__main"><?php the_title() ?></span>
    </p>
  </div>

  <?php 
  }; 
?>

  <!-- Display child page links -->
  <?php 

    // Get an array of child pages for the current post
    $testArray = get_pages(array(
      "child_of" => get_the_ID()
    ));

    // Check if the current post has a parent page or child pages
    if($theParent or $testArray) { ?>

  <!-- Display a div element with child page links -->
  <div class="page-links">
    <h2 class="page-links__title"><a
        href=" <?php echo get_permalink( $theParent ) ?>"><?php echo get_the_title($theParent) ?></a></h2>
    <ul class="min-list">

      <?php 
        // Set the "child_of" parameter for the wp_list_pages function
        // to display child pages of the current post's parent page
        // or the current post itself if it has no parent page
        if ($theParent) {
          $findChildOf = $theParent;
        } else {
          $findChildOf = get_the_ID();
        }

        // Use wp_list_pages to display the child pages
        wp_list_pages(array(
          "title_li" => NULL,
          "child_of" =>  $findChildOf,
          "sort_column" => "menu_order"
        ));
        
      ?>
    </ul>
  </div>

  <?php } ?>


  <div class="generic-content">
    <?php the_content() ?>
  </div>
</div>

<!--  -->

<div class="page-section page-section--beige">
  <div class="container container--narrow generic-content">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia voluptates vero vel temporibus aliquid
      possimus, facere accusamus modi. Fugit saepe et autem, laboriosam earum reprehenderit illum odit nobis,
      consectetur dicta. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos molestiae, tempora alias atque
      vero officiis sit commodi ipsa vitae impedit odio repellendus doloremque quibusdam quo, ea veniam, ad quod sed.
    </p>

    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia voluptates vero vel temporibus aliquid
      possimus, facere accusamus modi. Fugit saepe et autem, laboriosam earum reprehenderit illum odit nobis,
      consectetur dicta. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos molestiae, tempora alias atque
      vero officiis sit commodi ipsa vitae impedit odio repellendus doloremque quibusdam quo, ea veniam, ad quod sed.
    </p>
  </div>
</div>

<div class="page-section page-section--white">
  <div class="container container--narrow">
    <h2 class="headline headline--medium">Biology Professors:</h2>

    <ul class="professor-cards">
      <li class="professor-card__list-item">
        <a href="#" class="professor-card">
          <img class="professor-card__image" src="images/barksalot.jpg" />
          <span class="professor-card__name">Dr. Barksalot</span>
        </a>
      </li>
      <li class="professor-card__list-item">
        <a href="#" class="professor-card">
          <img class="professor-card__image" src="images/meowsalot.jpg" />
          <span class="professor-card__name">Dr. Meowsalot</span>
        </a>
      </li>
    </ul>
    <hr class="section-break" />

    <div class="row group generic-content">
      <div class="one-third">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia voluptates vero vel temporibus aliquid
          possimus, facere accusamus modi. Fugit saepe et autem, laboriosam earum reprehenderit illum odit nobis,
          consectetur dicta. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos molestiae, tempora alias
          atque vero officiis sit commodi ipsa vitae impedit odio repellendus doloremque quibusdam quo, ea veniam, ad
          quod sed.</p>
      </div>

      <div class="one-third">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia voluptates vero vel temporibus aliquid
          possimus, facere accusamus modi. Fugit saepe et autem, laboriosam earum reprehenderit illum odit nobis,
          consectetur dicta. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos molestiae, tempora alias
          atque vero officiis sit commodi ipsa vitae impedit odio repellendus doloremque quibusdam quo, ea veniam, ad
          quod sed.</p>
      </div>

      <div class="one-third">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia voluptates vero vel temporibus aliquid
          possimus, facere accusamus modi. Fugit saepe et autem, laboriosam earum reprehenderit illum odit nobis,
          consectetur dicta. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos molestiae, tempora alias
          atque vero officiis sit commodi ipsa vitae impedit odio repellendus doloremque quibusdam quo, ea veniam, ad
          quod sed.</p>
      </div>
    </div>
  </div>
</div>


<?php 
  }

  get_footer();
?>