<?php
/**
 * Template part for displaying header with ... .
 *
 * @package Sober
 */
?>

<div class="row">
	<div class="mobile-nav-toggle col-xs-3 col-sm-3 col-md-3 hidden-lg">
		<span class="toggle-nav" data-target="mobile-menu"><span class="icon-nav"></span></span>
	</div>

	<div class="site-branding col-xs-6 col-sm-6 col-md-6 col-lg-12">
		<?php get_template_part( 'template-parts/logo' ); ?>
	</div><!-- .site-branding -->

	<div class="header-icon header-icon-left col-lg-3 hidden-xs hidden-sm hidden-md">
		<ul class="menu-icon">
			<?php sober_header_icons( 'v5', 'left' ) ?>
		</ul>
	</div><!-- .header-icon -->

	<nav id="site-navigation" class="main-navigation site-navigation col-lg-6 hidden-xs hidden-sm hidden-md">
		<?php wp_nav_menu( array( 'theme_location' => 'primary', 'container' => false, 'menu_class' => 'nav-menu' ) ); ?>
	</nav><!-- #site-navigation -->

	<div class="header-icon header-icon-right col-xs-3 col-sm-3 col-md-3 col-lg-3">
		<ul class="hidden-xs hidden-sm hidden-md">
			<?php sober_header_icons( 'v5', 'right' ) ?>
		</ul>

		<?php if ( function_exists( 'WC' ) ) : ?>
			<a href="<?php echo esc_url( wc_get_cart_url() ) ?>" class="cart-contents menu-item-mobile-cart hidden-lg" data-toggle="modal" data-target="cart-modal" data-tab="cart">
				<?php sober_shopping_cart_icon() ?>
				<?php if ( sober_get_option( 'mobile_cart_badge' ) ) : ?>
					<span class="count cart-counter"><?php echo intval( WC()->cart->get_cart_contents_count() ) ?></span>
				<?php endif; ?>
			</a>
		<?php endif; ?>
	</div><!-- .header-icon -->
</div>