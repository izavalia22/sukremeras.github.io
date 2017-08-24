(function ( $ ) {
	'use strict';

	var sober = sober || {};

	sober.init = function () {
		this.$window = $( window );
		this.$body = $( document.body );
		this.$sideMenu = $( '.side-menu' );

		this.data = soberData || {};

		this.closeTopbar();
		this.menuHover();
		this.toggleSideMenu();
		this.toggleModal();
		this.removeCartItem();
		this.toggleTabs();
		this.focusInputs();
		this.filterProducts();
		this.sortProducts();
		this.productQuantity();
		this.productImagesLightbox();
		this.stickyProductSummary();
		this.stickUpSells();
		this.upsellsCarousel();
		this.checkBox();
		this.formatGallery();
		this.backToTop();
		this.toggleProductFilter();
		this.productQuickView();
		this.instanceSearch();
		this.fakeScrollbar();
		this.stickyHeader();
		this.navAjax();
		this.portfolioFilter();
		this.productVariationSwatches();
		this.productGallerySlider();
		this.productImageZoom();
		this.productImageSlider();
		this.singeProductAjaxAddToCart();
		this.openCartModalAfterAdd();
		this.pageHeaderParallax();
		this.responsive();
		this.preload();
		this.popup();
		this.addedToCartNotice();
		this.checkoutTerms();

		$( document.body ).trigger( 'sober_init', [sober] );
	};

	/**
	 * Check if a node is blocked for processing.
	 *
	 * @param {object} $node
	 * @return {bool} True if the DOM Element is UI Blocked, false if not.
	 */
	sober.isBlocked = function ( $node ) {
		return $node.is( '.processing' ) || $node.parents( '.processing' ).length;
	};

	/**
	 * Block a node visually for processing.
	 *
	 * @param {object} $node
	 */
	sober.block = function ( $node ) {
		if ( !sober.isBlocked( $node ) ) {
			$node.addClass( 'processing' ).block( {
				message   : null,
				overlayCSS: {
					background: '#fff',
					opacity   : 0.6
				}
			} );
		}
	};

	/**
	 * Unblock a node after processing is complete.
	 *
	 * @param {object} $node
	 */
	sober.unblock = function ( $node ) {
		$node.removeClass( 'processing' ).unblock();
	};

	/**
	 * Check if an element is in view-port or not
	 *
	 * @param el
	 * @returns {boolean}
	 */
	sober.isVisible = function ( el ) {
		if ( el instanceof jQuery ) {
			el = el[0];
		}

		var rect = el.getBoundingClientRect();

		return rect.bottom > 0 &&
			rect.right > 0 &&
			rect.left < ( window.innerWidth || document.documentElement.clientWidth ) &&
			rect.top < ( window.innerHeight || document.documentElement.clientHeight );
	};

	/**
	 * Post format gallery with carousel slider
	 */
	sober.formatGallery = function () {
		$( '.entry-gallery' ).addClass( 'owl-carousel' ).owlCarousel( {
			singleItem: true,
			items     : 1,
			navSpeed  : 800,
			nav       : true,
			dots      : false,
			autoplay  : true,
			dotsSpeed : 1000,
			rtl       : sober.data.isRTL === "1",
			navText   : ['<svg viewBox="0 0 20 20"><use xlink:href="#left-arrow"></use></svg>', '<svg viewBox="0 0 20 20"><use xlink:href="#right-arrow"></use></svg>']
		} );
	};

	/**
	 * Style checkboxes
	 */
	sober.checkBox = function () {
		// Checkbox: Ship to a different address
		$( '#ship-to-different-address' ).find( '.input-checkbox' ).on( 'change', function () {
			if ( $( this ).is( ':checked' ) ) {
				$( this ).parent().find( '.checkbox' ).addClass( 'checked' );
			} else {
				$( this ).parent().find( '.checkbox' ).removeClass( 'checked' );
			}
		} ).trigger( 'change' );
	};

	/**
	 * Load ajax on shop page and blog
	 */
	sober.navAjax = function () {
		// Blog & Portfolio
		sober.$body.on( 'click', '.ajax-navigation a', function ( e ) {
			e.preventDefault();

			var $button = $( this ),
				$nav = $button.parent(),
				$main = $( '#main' ),
				url = $button.attr( 'href' );

			if ( $nav.hasClass( 'loading' ) ) {
				return;
			}

			$nav.addClass( 'loading' );

			$.get(
				url,
				function ( response ) {
					var $response = $( response ),
						nextTitle = $response.filter( 'title' ).text();

					if ( $nav.hasClass( 'posts-navigation' ) ) {
						var $content = $( $response.find( '#main' ).html() );
						$content.hide();

						$main.append( $content );
						$content.fadeIn( 1000 );
						$nav.remove();
					} else if ( $nav.hasClass( 'portfolio-navigation' ) ) {
						var $items = $response.find( '.portfolio-items .portfolio' ),
							$link = $response.find( '.ajax-navigation a' );

						if ( $items.length ) {
							$items.imagesLoaded( function () {
								$main.find( '.portfolio-items' ).isotope( 'insert', $items );
							} );
							$nav.removeClass( 'loading' );

							if ( $link.length ) {
								$nav.html( $link );
							} else {
								$nav.fadeOut();
							}
						}
					}

					window.history.pushState( null, nextTitle, url );
				}
			);
		} );

		// Shop
		if ( 'ajax' === sober.data.shop_nav_type || 'infinity' === sober.data.shop_nav_type ) {
			sober.$body.on( 'click', '.woocommerce-pagination .next', function ( e ) {
				e.preventDefault();

				var $button = $( this ),
					$nav = $button.closest( '.woocommerce-pagination' ),
					$products = $nav.prev( 'ul.products' ),
					url = $button.attr( 'href' );

				if ( $button.hasClass( 'loading' ) ) {
					return;
				}

				$button.addClass( 'loading' );

				load_products( url, $products, function ( response ) {
					var $pagination = $( response ).find( '.woocommerce-pagination' );

					if ( $pagination.length ) {
						$nav.html( $pagination.html() );
					} else {
						$nav.html( '' );
					}
				} );
			} );
		}

		// Infinity Shop
		if ( 'infinity' === sober.data.shop_nav_type ) {
			var $nav = $( '.woocommerce-pagination' ),
				$button = $nav.find( '.next' ),
				$products = $( 'ul.products' );

			if ( $button.length ) {
				// Use this variable to control scroll event handle for better performance
				var waiting = false,
					endScrollHandle;

				sober.$window.on( 'scroll', function () {
					if ( waiting ) {
						return;
					}

					waiting = true;

					// clear previous scheduled endScrollHandle
					clearTimeout( endScrollHandle );

					infiniteScoll();

					setTimeout( function () {
						waiting = false;
					}, 100 );

					// schedule an extra execution of infiniteScoll() after 200ms
					// in case the scrolling stops in next 100ms
					endScrollHandle = setTimeout( function () {
						infiniteScoll();
					}, 200 );
				} );
			}

			var infiniteScoll = function () {
				// When almost reach to nav and new next button is exists
				if ( sober.isVisible( $nav ) && $button.length ) {
					if ( $button.hasClass( 'loading' ) ) {
						return;
					}

					$button.addClass( 'loading' );

					load_products( $button.attr( 'href' ), $products, function ( response ) {
						var $pagination = $( response ).find( '.woocommerce-pagination' );

						if ( $pagination.length ) {
							$nav.html( $pagination.html() );

							// Re-select because DOM has been changed
							$button = $nav.find( '.next' );
						} else {
							$nav.html( '' );
							$button.length = 0;
						}
					} );
				}
			}
		}

		/**
		 * Private function for ajax loading product
		 *
		 * @param url
		 * @param $holder
		 * @param callback
		 */
		function load_products( url, $holder, callback ) {
			$.get(
				url,
				function ( response ) {
					var $primary = $( response ).find( '#primary' ),
						$_products = $primary.find( 'ul.products' ).children();

					$_products.imagesLoaded( function () {
						$holder.isotope( 'insert', $_products );

						if ( 'function' === typeof callback ) {
							callback( response );
						}
					} );

					window.history.pushState( null, '', url );
				}
			);
		}
	};

	/**
	 * Close topbar
	 */
	sober.closeTopbar = function () {
		$( '#topbar' ).on( 'click', '.close', function ( e ) {
			e.preventDefault();

			$( this ).closest( '#topbar' ).slideUp();
		} );
	};

	/**
	 * Main navigation sub-menu hover
	 */
	sober.menuHover = function () {
		var animations = {
			none : ['show', 'hide'],
			fade : ['fadeIn', 'fadeOut'],
			slide: ['slideDown', 'slideUp']
		};

		var animation = sober.data.menu_animation ? animations[sober.data.menu_animation] : 'fade';

		$( '.site-navigation li, .topbar-menu li' ).on( 'mouseenter', function () {
			$( this ).addClass( 'active' ).children( '.sub-menu' ).stop( true, true )[animation[0]]();
		} ).on( 'mouseleave', function () {
			$( this ).removeClass( 'active' ).children( '.sub-menu' ).stop( true, true )[animation[1]]();
		} );
	};

	/**
	 *  Toggle modal
	 */
	sober.toggleModal = function () {
		sober.$body.on( 'click', '[data-toggle="modal"]', function ( e ) {
			e.preventDefault();

			var $el = $( this ),
				$target = $( '#' + $el.data( 'target' ) ),
				tab = $el.data( 'tab' );

			if ( !$target.length ) {
				return;
			}

			sober.openModal( $target, tab );
		} );

		sober.$body.on( 'click', '.close-modal, .sober-modal-backdrop', function ( e ) {
			e.preventDefault();

			sober.closeModal();
		} );

		// Close when press escape button
		$( document ).on( 'keyup', function ( e ) {
			if ( e.keyCode === 27 ) {
				sober.closeModal();
			}
		} );
	};

	/**
	 * Open modal
	 *
	 * @param $modal
	 * @param tab
	 */
	sober.openModal = function ( $modal, tab ) {
		$modal = $modal instanceof jQuery ? $modal : $( $modal );

		if ( ! $modal.length ) {
			return;
		}

		sober.$body.addClass( 'modal-open' );
		$modal.fadeIn();
		$modal.addClass( 'open' );

		if ( tab ) {
			var $tab = $modal.find( '.tab-nav' ).filter( '[data-tab="' + tab + '"]' );

			$tab.trigger( 'click' );
		}
	};

	/**
	 * Close modal
	 */
	sober.closeModal = function () {
		sober.$body.removeClass( 'modal-open' );

		var $opened = $( '.sober-modal.open' );

		$opened.fadeOut( function () {
			$( this ).removeClass( 'open' );
		} );

		sober.$body.trigger( 'sober_modal_closed', [$opened] );
	};

	/*
	 * Remove Cart Item
	 */
	sober.removeCartItem = function () {
		var $cartModal = $( '#cart-modal' );

		$cartModal.on( 'click', '.remove', function ( e ) {
			e.preventDefault();
			$cartModal.addClass( 'loading' );
			sober.block( $cartModal );
			var currentURL = $( this ).attr( 'href' );

			$.ajax( {
				type    : 'GET',
				url     : currentURL,
				dataType: 'html',
				success : function () {
					$( document.body ).trigger( 'wc_fragment_refresh' );

					$( document.body ).on( 'wc_fragments_refreshed', function () {
						$cartModal.removeClass( 'loading' );
						sober.unblock( $cartModal );
					} );
				}
			} );
		} );
	};

	/**
	 * Toggle side menu and its' child items
	 */
	sober.toggleSideMenu = function () {
		// Toggle side menu
		sober.$body.on( 'click', '.toggle-nav', function () {
			var target = '#' + $( this ).data( 'target' );

			$( target ).toggleClass( 'open' );
			sober.$body.toggleClass( 'side-menu-opened' );
		} );

		// Close when click to backdrop
		sober.$body.on( 'click touchstart', '.side-menu-backdrop', function () {
			$( '.side-menu' ).removeClass( 'open' );
			sober.$body.removeClass( 'side-menu-opened' );
		} );

		// Add class 'open' to current menu item
		sober.$sideMenu.find( '.menu > .menu-item-has-children, .menu > ul > .menu-item-has-children' ).filter( function () {
			return $( this ).hasClass( 'current-menu-item' ) || $( this ).hasClass( 'current-menu-ancestor' );
		} ).addClass( 'open' );

		// Toggle sub-menu
		sober.$sideMenu.on( 'click', '.menu > .menu-item-has-children > a, .menu > ul > .menu-item-has-children > a', function ( e ) {
			e.stopPropagation();
			e.preventDefault();

			$( this ).parent().toggleClass( 'open' ).children( 'ul' ).slideToggle();
			$( this ).parent().siblings( '.open' ).removeClass( 'open' ).children( 'ul' ).slideUp();
		} );
	};

	/**
	 * Focusing inputs and adds 'active' class
	 */
	sober.focusInputs = function () {

		$( '.woocommerce-account, .woocommerce-checkout' ).on( 'focus', '.input-text', function () {
			$( this ).closest( '.form-row' ).addClass( 'active' );
		} ).on( 'focusout', '.input-text', function () {
			if ( $( this ).val() === '' ) {
				$( this ).closest( '.form-row' ).removeClass( 'active' );
			}
		} ).find( '.input-text' ).each( function () {
			if ( $( this ).val() !== '' ) {
				$( this ).closest( '.form-row' ).addClass( 'active' );
			}
		} );


		$( '#commentform' ).on( 'focus', ':input', function () {
			$( this ).closest( 'p' ).addClass( 'active' );
		} ).on( 'focusout', ':input', function () {
			if ( $( this ).val() === '' ) {
				$( this ).closest( 'p' ).removeClass( 'active' );
			}
		} ).find( ':input' ).each( function () {
			if ( $( this ).val() !== '' ) {
				$( this ).closest( 'p' ).addClass( 'active' );
			}
		} );

	};

	/**
	 * Toggle tabs
	 */
	sober.toggleTabs = function () {
		sober.$body.on( 'click', '.tabs-nav .tab-nav', function () {
			var $tab = $( this ),
				tab = $tab.data( 'tab' );

			if ( $tab.hasClass( 'active' ) ) {
				return;
			}

			$tab.addClass( 'active' ).siblings( '.active' ).removeClass( 'active' );
			$tab.closest( '.tabs-nav' ).next( '.tab-panels' )
				.children( '[data-tab="' + tab + '"]' ).addClass( 'active' )
				.siblings( '.active' ).removeClass( 'active' );
		} )
	};

	/**
	 * Make products filterable with Isotope
	 */
	sober.filterProducts = function () {
		$( 'body.archive ul.products' ).imagesLoaded( function () {
			$( this.elements ).isotope( {
				itemSelector      : '.product',
				transitionDuration: 700,
				layoutMode        : 'fitRows',
				isOriginLeft      : !(sober.data.isRTL === '1')
			} );
		} );

		$( '.products-filter' ).on( 'click', 'li', function ( e ) {
			e.preventDefault();

			var $this = $( this ),
				selector = $this.attr( 'data-filter' );

			if ( $this.hasClass( 'active' ) ) {
				return;
			}

			$this.addClass( 'active' ).siblings( '.active' ).removeClass( 'active' );
			$this.closest( '.shop-toolbar' ).next( 'ul.products' ).isotope( {
				filter: selector
			} );
		} );
	};

	/**
	 * Use select2 to styling the dropdown of the ordring
	 */
	sober.sortProducts = function() {
		if ( ! $.fn.select2 ) {
			return;
		}

		$( '.woocommerce-ordering select' ).select2( {
			minimumResultsForSearch: -1,
			width: 'auto',
			dropdownAutoWidth: true
		} );
	};

	/**
	 * Change product quantity
	 */
	sober.productQuantity = function () {
		sober.$body.on( 'click', '.quantity .increase, .quantity .decrease', function ( e ) {
			e.preventDefault();

			var $this = $( this ),
				$qty = $this.siblings( '.qty' ),
				current = parseInt( $qty.val(), 10 ),
				min = parseInt( $qty.attr( 'min' ), 10 ),
				max = parseInt( $qty.attr( 'max' ), 10 );

			min = min ? min : 1;
			max = max ? max : current + 1;

			if ( $this.hasClass( 'decrease' ) && current > min ) {
				$qty.val( current - 1 );
				$qty.trigger( 'change' );
			}
			if ( $this.hasClass( 'increase' ) && current < max ) {
				$qty.val( current + 1 );
				$qty.trigger( 'change' );
			}
		} );
	};

	/**
	 * Make up sells products be sticky
	 */
	sober.stickUpSells = function () {
		if ( !sober.$body.hasClass( 'product-style-3' ) ) {
			return;
		}

		var $topbar = $( '#topbar' ),
			$header = $( '#masthead' ),
			$upsells = $( '.upsells' );

		if ( !$upsells.length ) {
			return;
		}

		var $primary = $( '#primary' );

		var offset = $topbar.length ? $topbar.outerHeight() : 0;
		offset += $header.length ? $header.outerHeight() : 0;

		$( window ).on( 'scroll', function () {
			if ( $( document ).scrollTop() >= offset ) {
				$upsells.addClass( 'sticky' );

				if ( !$upsells.data( 'wrap' ) ) {
					$upsells.wrap( '<div id="upsells-wrap" class="upsells-wrap"/>' );
					$upsells.data( 'wrap', true );
				}
			} else {
				$upsells.removeClass( 'sticky' );

				if ( $upsells.data( 'wrap' ) ) {
					$upsells.unwrap();
					$upsells.data( 'wrap', false );
				}
			}

			if ( $( window ).scrollTop() >= $primary.offset().top + $primary.outerHeight() - window.innerHeight ) {
				var $wrap = $( '#upsells-wrap' );

				$wrap.addClass( 'sticky-bottom' ).css( 'top', function () {
					return $( window ).scrollTop() - $primary.offset().top;
				} );

				if ( $wrap.outerHeight() <= $upsells.outerHeight() ) {
					$wrap.addClass( 'reach-bottom' );
				} else {
					$wrap.removeClass( 'reach-bottom' );
				}
			} else {
				$( '#upsells-wrap' ).removeClass( 'sticky-bottom' ).css( 'top', 0 );
			}
		} ).trigger( 'scroll' );
	};

	/**
	 * Prepare and init carousel for up sell products
	 */
	sober.upsellsCarousel = function () {
		if ( !sober.$body.hasClass( 'product-style-3' ) ) {
			return;
		}

		var $upsells = $( '.upsells' );

		if ( !$upsells.length ) {
			return;
		}

		if ( $upsells.find( 'li.product' ).length > 4 ) {
			$upsells.find( 'ul.products' ).addClass( 'owl-carousel' ).owlCarousel( {
				rtl          : sober.data.isRTL === "1",
				owl2row      : true,
				owl2rowTarget: 'product',
				dots         : true,
				nav          : true,
				navText      : ['<svg viewBox="0 0 20 20"><use xlink:href="#left-arrow"></use></svg>', '<svg viewBox="0 0 20 20"><use xlink:href="#right-arrow"></use></svg>'],
				items        : 2,
				responsive   : {
					0   : {
						items: 1
					},
					992 : {
						items: 1
					},
					1200: {
						items: 2
					}
				}
			} );
		}
	};

	/**
	 * Show photoSwipe lightbox for product images
	 */
	sober.productImagesLightbox = function () {
		if ( 'no' === sober.data.lightbox || '0' === sober.data.lightbox ) {
			return;
		}

		var $gallery = $( 'div.product div.images' ),
			$slides = $( '.woocommerce-product-gallery__slider .woocommerce-product-gallery__image', $gallery );

		if ( !$gallery.length ) {
			return;
		}

		$gallery.on( 'click', '.woocommerce-product-gallery__slider .woocommerce-product-gallery__image a', function ( e ) {
			e.preventDefault();

			var items = getGalleryItems(),
				$target = $( e.target ),
				$clicked = $target.closest( '.owl-item' ),
				options = {
					index              : $clicked.length ? $clicked.index() : $target.closest( '.woocommerce-product-gallery__image' ).index(),
					history            : false,
					bgOpacity          : 0.85,
					showHideOpacity    : true,
					mainClass          : 'pswp--minimal-dark',
					captionEl          : true,
					fullscreenEl       : false,
					shareEl            : false,
					tapToClose         : true,
					tapToToggleControls: false
				};

			var lightBox = new PhotoSwipe( $( '.pswp' ).get(0), window.PhotoSwipeUI_Default, items, options );
			lightBox.init();
		} );

		/**
		 * Private function to get gallery items
		 * @returns {Array}
		 */
		function getGalleryItems() {
			var items = [];

			if ( $slides.length > 0 ) {
				$slides.each( function( i, el ) {
					var img = $( el ).find( 'img' ),
						large_image_src = img.attr( 'data-large_image' ),
						large_image_w   = img.attr( 'data-large_image_width' ),
						large_image_h   = img.attr( 'data-large_image_height' ),
						item            = {
							src  : large_image_src,
							w    : large_image_w,
							h    : large_image_h,
							title: img.attr( 'data-caption' ) ? img.attr( 'data-caption' ) : ''
						};
					items.push( item );
				} );
			}

			return items;
		}
	};

	/**
	 * Make product summary be sticky when use product layout 1
	 */
	sober.stickyProductSummary = function () {
		if ( $.fn.stick_in_parent && sober.$window.width() > 767 ) {
			$( 'div.product .sticky-summary' ).stick_in_parent( {
				parent: '.product-summary'
			} );
		}
	};

	/**
	 * Back to top icon
	 */
	sober.backToTop = function () {
		sober.$body.on( 'click', '#gotop', function ( e ) {
			e.preventDefault();

			$( 'html, body' ).animate( {scrollTop: 0}, 'slow' );
		} );
	};

	/**
	 * Toggle product filter widgets
	 */
	sober.toggleProductFilter = function () {
		sober.$body.on( 'click', '.toggle-filter', function ( e ) {
			e.preventDefault();

			$( this ).next( '.filter-widgets' ).fadeIn( function () {
				$( this ).addClass( 'active' );
			} );
		} ).on( 'click', '.filter-widgets button.close', function () {
			$( this ).closest( '.filter-widgets' ).fadeOut( function () {
				$( this ).removeClass( 'active' );
			} );
		} );

	};

	/**
	 * Toggle product quick view
	 */
	sober.productQuickView = function () {
		if ( !sober.$body.hasClass( 'product-quickview-enable' ) ) {
			return;
		}

		var target = 'ul.products .woocommerce-LoopProduct-link';

		switch ( sober.data.quickview ) {
			case 'buy_button':
				target = 'ul.products .add_to_cart_button, ul.products .button.product_type_external';
				break;

			case 'view_button':
				target = 'ul.products .quick_view_button';
				break;

			case 'title':
				target = 'ul.products h3 a';
				break;
		}

		sober.$body.on( 'click', target, function ( e ) {
			if ( sober.$window.width() <= 768 ) {
				return;
			}

			e.preventDefault();

			var $a = $( this ),
				url = $a.data( 'url' ) ? $a.data( 'url' ) : $a.attr( 'href' ),
				$modal = $( '#quick-view-modal' ),
				$product = $modal.find( '.product' ),
				$button = $modal.find( '.modal-header .close-modal' ).first().clone();

			$product.hide().html( '' ).addClass( 'invisible' );
			$modal.addClass( 'loading' );
			sober.openModal( $modal );

			$.get( url, function ( response ) {
				var $html = $( response ),
					$summary = $html.find( '#content' ).find( '.product-summary' ),
					$gallery = $summary.find( '.images' ),
					$variations = $summary.find( '.variations_form' ),
					$carousel = $( '.woocommerce-product-gallery__slider', $gallery );

				// Remove unused elements
				$summary.find( '.product-toolbar' ).remove();
				$summary.find( 'h1.product_title' ).wrapInner( '<a href="' + url + '"></a>' );
				$gallery.find( '.thumbnails' ).remove();
				$product.show().html( $summary ).prepend( $button );

				// Force height for images
				$carousel.find( 'img' ).css( 'height', $product.outerHeight() );

				if ( $carousel.children().length > 1 ) {
					$carousel.addClass( 'owl-carousel' ).owlCarousel( {
						rtl       : sober.data.isRTL === "1",
						items     : 1,
						smartSpeed: 500,
						dots      : false,
						nav       : true,
						navText   : ['<svg width="20" height="20"><use xlink:href="#left-arrow"></use></svg>', '<svg width="20" height="20"><use xlink:href="#right-arrow"></use></svg>'],
					} );
				}

				$gallery.css( 'opacity', 1 );

				$carousel.on( 'click', '.woocommerce-product-gallery__image a', function( event ) {
					event.preventDefault();
				} );

				$variations.wc_variation_form().find( '.variations select:eq(0)' ).change();

				if ( $.fn.tawcvs_variation_swatches_form ) {
					$variations.tawcvs_variation_swatches_form();
					sober.modifyVariationSwatches( $variations );
				}

				$variations.on( 'reset_image found_variation', function() {
					$carousel.trigger( 'to.owl.carousel', [0] );
				} );

				$modal.removeClass( 'loading' );
				$product.removeClass( 'invisible' );

				if ( typeof SimpleScrollbar !== 'undefined' ) {
					SimpleScrollbar.initEl( $summary.find( '.summary' ).get( 0 ) );
				}

				sober.$body.trigger( 'sober_quickview_opened', [$html, $modal, sober] );
			}, 'html' );

			if ( 'buy_button' === sober.data.quickview ) {
				return false; // Prevent ajax add to cart
			}
		} );
	};

	/**
	 * Product instance search
	 */
	sober.instanceSearch = function () {
		var xhr = null,
			searchCache = {},
			$modal = $( '#search-modal' ),
			$form = $modal.find( 'form' ),
			$search = $form.find( 'input.search-field' ),
			$results = $modal.find( '.search-results' );

		$modal.on( 'keyup', '.search-field', function ( e ) {
			var valid = false;

			if ( typeof e.which === 'undefined' ) {
				valid = true;
			} else if ( typeof e.which === 'number' && e.which > 0 ) {
				valid = !e.ctrlKey && !e.metaKey && !e.altKey;
			}

			if ( !valid ) {
				return;
			}

			if ( xhr ) {
				xhr.abort();
			}

			search();
		} ).on( 'change', '.product-cats input', function () {
			if ( xhr ) {
				xhr.abort();
			}

			search();
		} ).on( 'click', '.search-reset', function () {
			if ( xhr ) {
				xhr.abort();
			}

			$results.find( '.woocommerce, .buttons' ).slideUp( function () {
				$modal.removeClass( 'searching searched found-products found-no-product invalid-length' );
			} );
		} ).on( 'focusout', '.search-field', function () {
			if ( $search.val().length < 2 ) {
				$results.find( '.woocommerce, .buttons' ).slideUp( function () {
					$modal.removeClass( 'searching searched found-products found-no-product invalid-length' );
				} );
			}
		} );

		/**
		 * Private function for search
		 */
		function search() {
			var keyword = $search.val();

			if ( keyword.length < 2 ) {
				$modal.removeClass( 'searching found-products found-no-product' ).addClass( 'invalid-length' );
				return;
			}

			var url = $form.attr( 'action' ) + '?' + $form.serialize();

			$modal.removeClass( 'found-products found-no-product' ).addClass( 'searching' );

			if ( keyword in searchCache ) {
				var result = searchCache[keyword];

				$modal.removeClass( 'searching' );

				if ( result.found ) {
					$modal.addClass( 'found-products' );

					$results.find( '.woocommerce' ).html( result.products );
					$results.find( '.buttons a' ).attr( 'href', url );

					$results.find( '.woocommerce, .buttons' ).slideDown( function () {
						$modal.removeClass( 'invalid-length' );
					} );
				} else {
					$modal.addClass( 'found-no-product' );

					$results.find( '.woocommerce' ).html( $( '<div class="not-found text-center" />' ).text( result.text ) );
					$results.find( '.buttons a' ).attr( 'href', '#' );

					$results.find( '.buttons' ).slideUp();
					$results.find( '.woocommerce' ).slideDown( function () {
						$modal.removeClass( 'invalid-length' );
					} );
				}

				$modal.addClass( 'searched' );
			} else {
				xhr = $.get( url, function ( response ) {
					var $html = $( response ),
						$products = $html.find( '#content #primary ul.products' ),
						$info = $html.find( '#content #primary .woocommerce-info' );

					$modal.removeClass( 'searching' );

					if ( $products.length ) {
						$products.children( '.last' ).nextAll().remove();

						$modal.addClass( 'found-products' );

						$results.find( '.woocommerce' ).html( $products );
						$results.find( '.buttons a' ).attr( 'href', url );

						$results.find( '.woocommerce, .buttons' ).slideDown( function () {
							$modal.removeClass( 'invalid-length' );
						} );

						// Cache
						searchCache[keyword] = {
							found   : true,
							products: $products
						};
					} else if ( $info.length ) {
						$modal.addClass( 'found-no-product' );

						$results.find( '.woocommerce' ).html( $( '<div class="not-found text-center" />' ).text( $info.text() ) );
						$results.find( '.buttons a' ).attr( 'href', '#' );

						$results.find( '.buttons' ).slideUp();
						$results.find( '.woocommerce' ).slideDown( function () {
							$modal.removeClass( 'invalid-length' );
						} );

						// Cache
						searchCache[keyword] = {
							found: false,
							text : $info.text()
						};
					}

					$modal.addClass( 'searched' );
				}, 'html' );
			}
		}
	};

	/**
	 * Init simple scrollbar
	 */
	sober.fakeScrollbar = function () {
		var el = document.querySelector( '.primary-menu.side-menu' );

		if ( el && typeof SimpleScrollbar !== 'undefined' ) {
			SimpleScrollbar.initEl( el );
		}
	};

	/**
	 * Sticky header
	 */
	sober.stickyHeader = function () {
		if ( !sober.data.sticky_header || 'none' === sober.data.sticky_header ) {
			return;
		}

		var header = document.getElementById( 'masthead' );
		var topbar = document.getElementById( 'topbar' );
		var offset = 0;

		// Prepare for white header
		if (
			sober.$body.hasClass( 'header-white' )
			|| ( sober.$body.hasClass( 'no-page-header' ) && !sober.$body.hasClass( 'page-title-hidden' ) && !sober.$body.hasClass( 'page-template-homepage' ) )
		) {
			if ( topbar ) {
				topbar.style.marginBottom = header.clientHeight + 'px';
			} else {
				document.getElementById( 'page' ).style.paddingTop = header.clientHeight + 'px';
			}
		}

		if ( 'smart' === sober.data.sticky_header && typeof Headroom !== 'undefined' ) {
			offset = topbar ? topbar.clientHeight : 1;

			var stickyHeader = new Headroom( header, {
				offset  : offset,
				onTop   : function () {
					setTimeout( function () {
						header.classList.remove( 'headroom--animation' );
					}, 500 );
				},
				onNotTop: function () {
					setTimeout( function () {
						header.classList.add( 'headroom--animation' );
					}, 10 );
				}
			} );

			stickyHeader.init();
		} else if ( 'normal' === sober.data.sticky_header ) {
			offset = topbar ? topbar.clientHeight : 1;
			sticky();

			sober.$window.on( 'scroll', function () {
				sticky();
			} );
		}

		/**
		 * Private function for sticky header
		 */
		function sticky() {
			if ( sober.$window.scrollTop() >= offset ) {
				header.classList.add( 'sticky' );
			} else {
				header.classList.remove( 'sticky' );
			}
		}
	};

	/**
	 * Initialize isotope for portfolio items
	 */
	sober.portfolioFilter = function () {
		var $items = $( '.portfolio-items' );

		if ( !$items.length ) {
			return;
		}

		var options = {
			itemSelector      : '.portfolio',
			transitionDuration: 700,
			isOriginLeft      : !(sober.data.isRTL === '1')
		};

		if ( sober.$body.hasClass( 'portfolio-fullwidth' ) ) {
			options.masonry = {
				columnWidth: '.col-md-3'
			};
		}

		$items.imagesLoaded( function () {
			$( this.elements ).isotope( options );
		} );

		var $filter = $( '.portfolio-filter' );

		$filter.on( 'click', 'li', function ( e ) {
			e.preventDefault();

			var $this = $( this ),
				selector = $this.attr( 'data-filter' );

			if ( $this.hasClass( 'active' ) ) {
				return;
			}

			$this.addClass( 'active' ).siblings( '.active' ).removeClass( 'active' );
			$this.closest( '.portfolio-filter' ).next( '.portfolio-items' ).isotope( {
				filter: selector
			} );
		} );
	};

	/**
	 * Add extra script for product variation swatches
	 * This function will run after plugin swatches did
	 */
	sober.productVariationSwatches = function () {
		sober.$body.on( 'tawcvs_initialized', function () {
			var $form = $( '.variations_form' );

			sober.modifyVariationSwatches( $form );
		} );
	};

	/**
	 * Modify variation swatches
	 * This function is used in sober.productVariationSwatches and sober.productQuickView
	 *
	 * @param $form
	 */
	sober.modifyVariationSwatches = function ( $form ) {
		var $variables = $form.find( '.variations .variable' );

		// Remove class "swatches-support" if there is no swatches in this product
		var hasSwatches = false;
		$variables.each( function() {
			if ( $( this ).hasClass( 'swatches' ) ) {
				hasSwatches = true;
			}
		} );

		if ( ! hasSwatches ) {
			$form.removeClass( 'swatches-support' );
		}

		// Add class for the last even variation
		if ( $variables.length % 2 ) {
			$variables.last().addClass( 'wide-variable' );
		}

		// Change alert style
		$form.off( 'tawcvs_no_matching_variations' );
		$form.on( 'tawcvs_no_matching_variations', function () {
			event.preventDefault();

			$form.find( '.woocommerce-variation.single_variation' ).show();
			if ( typeof wc_add_to_cart_variation_params !== 'undefined' ) {
				$form.find( '.single_variation' ).stop( true, true ).slideDown( 500 ).html( '<p class="invalid-variation-combination">' + wc_add_to_cart_variation_params.i18n_no_matching_variations_text + '</p>' );
			}
		} );
	};

	/**
	 * Init product gallery as a slider
	 */
	sober.productGallerySlider = function() {
		if ( ! sober.$body.hasClass( 'single-product' ) ) {
			return;
		}

		var $gallery = $( 'div.product div.images' ),
			$carousel = $( '.woocommerce-product-gallery__slider', $gallery ),
			$thumbnails = $( '.thumbnails', $gallery );

		if ( !sober.$body.hasClass( 'product-style-1' ) && !sober.$body.hasClass( 'product-style-4' ) && $carousel.children().length > 1 && !$carousel.hasClass( 'owl-loaded' ) ) {
			$carousel.addClass( 'owl-carousel' ).owlCarousel( {
				rtl       : sober.data.isRTL === "1",
				dots      : false,
				items     : 1,
				loop      : false,
				responsive: {
					0: {
						items: 1
					}
				}
			} );
		}

		if ( sober.$body.hasClass( 'product-style-1' ) && $carousel.children().length > 1 ) {
			if ( sober.$window.width() < 992 && ! $carousel.hasClass( 'owl-carousel' ) ) {
				$carousel.addClass( 'owl-carousel' ).owlCarousel( {
					rtl       : sober.data.isRTL === "1",
					items     : 1,
					loop      : false,
					margin    : 10,
					responsive: {
						0: {
							items: 1
						}
					}
				} );
			} else if ( sober.$window.width() >= 992 && $carousel.hasClass( 'owl-carousel' ) ) {
				$carousel.trigger( 'destroy.owl.carousel' ).removeClass( 'owl-carousel' );
			}
		}

		if ( sober.$body.hasClass( 'product-style-4' ) && $carousel.children().length > 1 ) {
			var start = $carousel.children().length > 2 ? 1 : 0;

			$carousel.addClass( 'owl-carousel' ).owlCarousel( {
				rtl   : sober.data.isRTL === "1",
				items : 2,
				startPosition: start,
				loop  : false,
				margin: 30,
				center: true,
				dots: false,
				nav: true,
				navText: ['<svg viewBox="0 0 20 20"><use xlink:href="#left-arrow"></use></svg>', '<svg viewBox="0 0 20 20"><use xlink:href="#right-arrow"></use></svg>']
			} );
		}

		// Show it
		$gallery.css( 'opacity', 1 );

		// Use thumbnails as pagination
		$gallery.on( 'click', '.thumbnails .woocommerce-product-gallery__image a', function( event ) {
			event.preventDefault();

			var $image = $( this ).closest( '.woocommerce-product-gallery__image' );

			$carousel.trigger( 'to.owl.carousel', [$image.index()] );
		} );

		// Change the active state of thumbnails
		$carousel.on( 'translated.owl.carousel', function( event ) {
			$thumbnails.children().removeClass( 'active' ).eq( event.item.index ).addClass( 'active' );
		} );

		// Variation form changed
		$( '.variations_form' ).on( 'reset_image found_variation', function() {
			$carousel.trigger( 'to.owl.carousel', [0] );
		} ).on( 'reset_image', function() {
			$thumbnails.children( ':eq(0)' ).find( 'img' ).wc_reset_variation_attr( 'src' );
		} ).on( 'found_variation', function( event, variation ) {
			$thumbnails.children( ':eq(0)' ).find( 'img' ).wc_set_variation_attr( 'src', variation.image.thumb_src );
		} );
	};

	/**
	 * Zoom product image when hover
	 */
	sober.productImageZoom = function() {
		var $thumbnails = $( '.product-thumbnail-zoom' );

		$thumbnails.each( function () {
			var $el = $( this );

			$el.zoom( {
				url: $el.attr( 'data-zoom_image' )
			} );
		} );
	};

	/**
	 * Display product thumbnail images as slider
	 */
	sober.productImageSlider = function() {
		$( '.product-images__slider' ).owlCarousel( {
			items: 1,
			lazyLoad: true,
			dots: false,
			nav: true,
			navText: ['<svg viewBox="0 0 14 20"><use xlink:href="#left"></use></svg>', '<svg viewBox="0 0 14 20"><use xlink:href="#right"></use></svg>']
		} );
	};

	/**
	 * Ajaxify add to cart button on single product page
	 */
	sober.singeProductAjaxAddToCart = function () {
		if ( 'yes' !== sober.data.single_ajax_add_to_cart ) {
			return;
		}

		sober.$body.on( 'submit', 'form.cart', function () {
			var $form = $( this ),
				$button = $form.find( '.single_add_to_cart_button' ),
				url = $form.attr( 'action' ) ? $form.attr( 'action' ) : window.location.href;

			if ( $button.hasClass( 'loading' ) ) {
				return false;
			}

			$button.removeClass( 'added' ).addClass( 'loading' );

			$.ajax( {
				url    : url,
				data   : $form.serialize(),
				method : 'POST',
				success: function ( response ) {
					$button.removeClass( 'loading' ).addClass( 'added' );

					// Show alert bar
					if ( sober.data.open_cart_modal_after_add !== '1' ) {
						var $message = $( response ).find( '.woocommerce-error, .woocommerce-info, .woocommerce-message' ),
							$alert = $( '.sober-alert-bar' );

						if ( !$alert.length ) {
							$alert = $( '<div class="sober-alert-bar"></div>' );
							sober.$body.append( $alert );
						}

						$alert.html( $message );
						setTimeout( function () {
							$alert.addClass( 'active' );
						}, 500 );

						// Auto hide the alert bar after 5 seconds. Apply for success actions only
						if ( $message.hasClass( 'woocommerce-message' ) ) {
							setTimeout( function () {
								$alert.removeClass( 'active' );
							}, 5000 );
						}
					} else {
						sober.$body.trigger( 'added_to_cart' );
					}

					// Trigger fragment refresh
					sober.$body.trigger( 'wc_fragment_refresh' );

					if ( typeof wc_add_to_cart_params !== 'undefined' ) {
						if ( wc_add_to_cart_params.cart_redirect_after_add === 'yes' && wc_add_to_cart_params.cart_url ) {
							window.location.href = wc_add_to_cart_params.cart_url;
						}
					}
				}
			} );

			return false;
		} );

		// Close alert bar
		sober.$body.on( 'click', '.sober-alert-bar .close', function ( e ) {
			e.preventDefault();

			$( this ).closest( '.sober-alert-bar' ).removeClass( 'active' );
		} );
	};

	/**
	 * Open the cart modal after successful addition
	 */
	sober.openCartModalAfterAdd = function () {
		if ( sober.data.open_cart_modal_after_add !== '1' ) {
			return;
		}

		sober.$body.on( 'added_to_cart', function () {
			sober.closeModal();
			sober.openModal( '#cart-modal', 'cart' );
		} );
	};

	/**
	 * Init parallax for page header elements
	 */
	sober.pageHeaderParallax = function () {
		if ( typeof Rellax === 'undefined' ) {
			return;
		}

		var $title = $( '.page-header .page-title' ),
			$breadcrumb = $( '.page-header .breadcrumb' );

		if ( 'up' === sober.data.page_header_parallax ) {
			if ( $title.length ) {
				new Rellax( '.page-header .page-title', {speed: 1} );
			}
			if ( $breadcrumb.length ) {
				new Rellax( '.page-header .breadcrumb', {speed: 2} );
			}
		} else if ( 'down' === sober.data.page_header_parallax ) {
			if ( $title.length ) {
				new Rellax( '.page-header .page-title', {speed: -2} );
			}
			if ( $breadcrumb.length ) {
				new Rellax( '.page-header .breadcrumb', {speed: -1} );
			}
		}
	};

	/**
	 * Add page preloader
	 */
	sober.preload = function () {
		var $preloader = $( '#preloader' );

		if ( ! $preloader.length ) {
			return;
		}

		sober.$window.on( 'beforeunload', function() {
			$preloader.fadeIn( 'slow' );
		});

		$preloader.fadeOut( 800 );
	};

	/**
	 * Call functions for responsiveness
	 */
	sober.responsive = function () {
		// Initialize fitvids
		sober.responsiveVideos();

		// Init/destroy product image carousel for product style 1
		sober.$window.on( 'resize', sober.productGallerySlider );
	};

	/**
	 * Responsive videos
	 */
	sober.responsiveVideos = function () {
		$( document.body ).fitVids();
	};

	/**
	 * Open popup
	 */
	sober.popup = function() {
		var days = parseInt( sober.data.popup_frequency ),
			delay = parseInt( sober.data.popup_visible_delay );

		if ( days > 0 && document.cookie.match( /^(.*;)?\s*sober_popup\s*=\s*[^;]+(.*)?$/ ) ) {
			return;
		}

		delay = Math.max( delay, 0 );
		delay = 'delay' === sober.data.popup_visible ? delay : 0;

		sober.$window.on( 'load', function() {
			setTimeout( function() {
				sober.openModal( '#popup' );
			}, delay * 1000 );
		} );

		sober.$body.on( 'sober_modal_closed', function (event, modal) {
			if ( ! modal.hasClass( 'sober-popup' ) ) {
				return;
			}

			var date = new Date(),
				value = date.getTime();

			date.setTime( date.getTime() + (days * 24 * 60 * 60 * 1000) );

			document.cookie = 'sober_popup=' + value + ';expires=' + date.toGMTString() + ';path=/';
		} );
	};

	/**
	 * Show a notification after added a product to cart successfully
	 */
	sober.addedToCartNotice = function() {
		if ( ! sober.data.added_to_cart_notice || ! $.fn.notify ) {
			return;
		}

		$.notify.addStyle( 'sober', {
			html: '<div><svg viewBox="0 0 20 20" class="message-icon"><use xlink:href="#success" href="#success"></use></svg><span data-notify-text/></div>'
		});

		$( document ).on( 'added_to_cart', function() {
			$.notify( sober.data.l10n.added_to_cart_notice, {
				autoHideDelay: 2000,
				className: 'success',
				style: 'sober',
				showAnimation: 'fadeIn',
				hideAnimation: 'fadeOut'
			} );
		} );
	};

	/**
	 * Turn off the event handler for terms and conditions link
	 */
	sober.checkoutTerms = function() {
		sober.$body.off( 'click', 'a.woocommerce-terms-and-conditions-link' );
	};

	/**
	 * Document ready
	 */
	$( function () {
		sober.init();
	} );
})( jQuery );
