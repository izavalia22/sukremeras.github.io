<?php
/**
 * Template part for displaying header with left menu ( default ).
 *
 * @package Sober
 */
?>

<div class="row">
	<nav id="site-navigation" class="main-navigation site-navigation col-xs-3 col-sm-3 col-md-3 col-lg-5">
		<span class="toggle-nav hidden-lg" data-target="mobile-menu"><span class="icon-nav"></span></span>
		<?php wp_nav_menu( array(
			'theme_location' => 'primary',
			'container'      => false,
			'menu_class'     => 'nav-menu',
		) ); ?>
	</nav><!-- #site-navigation -->

	<div class="site-branding col-xs-6 col-sm-6 col-md-6 col-lg-2">
		<?php get_template_part( 'template-parts/logo' ); ?>
	</div><!-- .site-branding -->

	<div class="header-icon col-xs-3 col-sm-3 col-md-3 col-lg-5">
		<ul class="hidden-xs hidden-sm hidden-md">
			<?php sober_header_icons( 'v1' ) ?>
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