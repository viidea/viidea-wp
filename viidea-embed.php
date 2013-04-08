<?php

/*
Plugin Name: Viidea.com embed
Plugin URI: http//viidea.com/wordpress_plugin/
Description: Plugin for embedding viidea.com videos
Version: 0.1
License: GPL3
*/

function viidea_addbuttons() {
    if (!current_user_can('edit_pages') && !current_user_can('edit_posts')) {
        return;
    }
    if (!get_user_option('rich_editing')) {
        return;
    }

    add_filter('mce_external_plugins', 'viidea_add_tinymce_plugin');
    add_filter('mce_buttons', 'viidea_register_button');
}

function viidea_register_button($buttons) {
    array_push($buttons, 'viidea');
    return $buttons;
}

function viidea_add_tinymce_plugin($plugin_array) {
    $path = plugins_url( 'editor_plugin.js', __FILE__);
    $plugin_array['viidea'] = $path;
    return $plugin_array;
}

add_action('init', 'viidea_addbuttons');

function viidea_iframe_embed_shortcode($atts) {
    extract(shortcode_atts(array(
        'hostname' => '',
        'slug' => '',
        'type' => 'popup',
        'tabs' => 'No',
        'html5' => 'No',
        'width' => '640',
        'height' => '360',
        //'part' => '1',
        //'open' => 'No',
        //'logo' => 'Yes'
        // allow fullscreen
        // width
        // height
    ), $atts));

    $tabs == 'No' ? '0' : '1';
    $html5 == 'No' ? '0' : '1';
    $open == 'No' ? '0' : '1';

    if (substr($hostname, 0, 8) != 'https://'
        && substr($hostname, 0, 7) != 'http://') {
        $hostname = 'http://'.$hostname;
    }

    // make code
    $embed = '';
    $qs = '';
    if ($html5 == '1') { $qs.='html5=1&'; }
    if ($type == 'popup') {
        if ($tabs == '1') { $qs.='tabs=1&'; }
        $embed.= '<script src="'.$hostname.'/'.$slug.'/embed.js?'.$qs.'">';
    } else if ($type == 'iframe') {
        $embed.= '<iframe src="'.$hostname.'/'.$slug.'/iframe/1/?'.$qs.'" width="'.$width.'" height="'.$height.'" frameborder="0" mozallowfullscreen="1" webkitallowfullscreen="1" scrolling="no"></iframe>';
    }

    return $embed;
}

add_shortcode('viidea', 'viidea_iframe_embed_shortcode');

?>