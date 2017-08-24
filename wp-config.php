<?php
/**
 * Configuración básica de WordPress.
 *
 * Este archivo contiene las siguientes configuraciones: ajustes de MySQL, prefijo de tablas,
 * claves secretas, idioma de WordPress y ABSPATH. Para obtener más información,
 * visita la página del Codex{@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} . Los ajustes de MySQL te los proporcionará tu proveedor de alojamiento web.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** Ajustes de MySQL. Solicita estos datos a tu proveedor de alojamiento web. ** //
/** El nombre de tu base de datos de WordPress */
define('DB_NAME', 'sukremeras');

/** Tu nombre de usuario de MySQL */
define('DB_USER', 'izavalia@localhost');

/** Tu contraseña de MySQL */
define('DB_PASSWORD', 'cryptoMonsun22');

/** Host de MySQL (es muy probable que no necesites cambiarlo) */
define('DB_HOST', 'localhost');

/** Codificación de caracteres para la base de datos. */
define('DB_CHARSET', 'utf8mb4');

/** Cotejamiento de la base de datos. No lo modifiques si tienes dudas. */
define('DB_COLLATE', '');

/**#@+
 * Claves únicas de autentificación.
 *
 * Define cada clave secreta con una frase aleatoria distinta.
 * Puedes generarlas usando el {@link https://api.wordpress.org/secret-key/1.1/salt/ servicio de claves secretas de WordPress}
 * Puedes cambiar las claves en cualquier momento para invalidar todas las cookies existentes. Esto forzará a todos los usuarios a volver a hacer login.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', 'LoFsj[rxHG[.JU+7Pd9-*:ot:I].JgX0>6Ih%DV8#_BKht,<atn{4-?mv8<|o8({');
define('SECURE_AUTH_KEY', 'Er{4^6Ja25TJ0IrtGfy(t4hH7<UV]R}6IvjhO91n?NBSL8I$OV,a{CQyZ%% <](1');
define('LOGGED_IN_KEY', '^_|C|r?gT/r?s@2n@6WW]~Z#=qwH(~h%QpZ#brEa9$L(fwtG/TNt=?PlVN{3(5II');
define('NONCE_KEY', 'j_y5OGW~90x5^8iH[C6=0HXj6mHHjK^n`1 D{Z= :btqK-rp=}~d|Z0tKrR%*p_F');
define('AUTH_SALT', 'V O>O=~1t#GW[UN3%zd%]R5`tPWXR!IL$cxb;#&dJGCptvll)A;M?+b{jA.ozfL(');
define('SECURE_AUTH_SALT', 'sw}}1pF-g6>FVsHF+mJ-!|Eej=EY01}ZC&FHVRCAVPq;t;DJ;R mnC38akak~[w^');
define('LOGGED_IN_SALT', 'Z}(T=4D.<MGYXgh`IF(7-i~6ZR:qoHze(=,I<G}|B6&Q(`RD6g$^/.(9mb8d_hl]');
define('NONCE_SALT', 'WI 6*@3nfT>zOvhpwpO~xq)X>O._(}tai^nk(YxwO.bo0%g4a^ZsLryfKS?2vV%}');

/**#@-*/

/**
 * Prefijo de la base de datos de WordPress.
 *
 * Cambia el prefijo si deseas instalar multiples blogs en una sola base de datos.
 * Emplea solo números, letras y guión bajo.
 */
$table_prefix  = 'wp_';


/**
 * Para desarrolladores: modo debug de WordPress.
 *
 * Cambia esto a true para activar la muestra de avisos durante el desarrollo.
 * Se recomienda encarecidamente a los desarrolladores de temas y plugins que usen WP_DEBUG
 * en sus entornos de desarrollo.
 */
define('WP_DEBUG', false);

/* ¡Eso es todo, deja de editar! Feliz blogging */

/** WordPress absolute path to the Wordpress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
