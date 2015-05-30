
<?php
    include('db.php');
    set_time_limit(180);
    function testName($x, $y) {
        if( strpos($x, $y) !== false) {
            return true;
        }
    }
    function get_data($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 999);
        curl_setopt($ch, CURLOPT_URL, $url);
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }


    do {
        $decoded_flow = json_decode($content_flow, true);
        foreach ($decoded_flow['data'] as $post) {
            foreach ($post as $content => $key) {
                $grpid = substr($post['id'], 0, 15);
                $postid = substr($post['id'], 16, 15);
                $poster = $post['from']['name'];
                $date = substr($post['created_time'], 0, 10);
                $name = $post['name'];
                $type = "flow";
                /* $likes = json_decode(get_data("https://graph.facebook.com/{$postid}/likes?summary=true&access_token=".$token), true);
                 $like_counter = $likes['summary']['total_count'];*/
                if($content === 'link' && testName($key, 'youtube')) {
                    $pos1 = strpos($key, "v=");
                    $link = "http://www.youtube.com/watch?v=".substr($key, $pos1+2, 11);
                    $fblink = "https://www.facebook.com/groups/{$grpid}/permalink/{$postid}/";
                    mysqli_real_query($sqllink, 'INSERT INTO dnb4teh VALUES (DEFAULT, "'.$name.'", "'.$poster.'", "'.$link.'", "'.$fblink.'", "'.$date.'", "'.$type.'", "youtube", "'.$like_counter.'")');
                }
                if($content === 'link' && testName($key, 'soundcloud')) {
                    $link = $key;
                    $fblink = "https://www.facebook.com/groups/{$grpid}/permalink/{$postid}/";
                    mysqli_real_query($sqllink, 'INSERT INTO dnb4teh VALUES (DEFAULT, "'.$name.'", "'.$poster.'", "'.$link.'", "'.$fblink.'", "'.$date.'", "'.$type.'", "soundcloud", "'.$like_counter.'")');
                }
            }
        }
        $content_flow = get_data($decoded_flow['paging']['next']);
    }
    while(!empty($decoded_flow['data']));

    do {
        $decoded_press = json_decode($content_press, true);
        foreach ($decoded_press['data'] as $post) {
            foreach ($post as $content => $key) {
                $grpid = substr($post['id'], 0, 15);
                $postid = substr($post['id'], 16, 15);
                $poster = $post['from']['name'];
                $date = substr($post['created_time'], 0, 10);
                $name = $post['name'];
                $type = "press";
               /* $likes = json_decode(get_data("https://graph.facebook.com/{$postid}/likes?summary=true&access_token=".$token), true);
                $like_counter = $likes['summary']['total_count'];*/
                if($content === 'link' && testName($key, 'youtube')) {
                    $pos1 = strpos($key, "v=");
                    $link = "http://www.youtube.com/watch?v=".substr($key, $pos1+2, 11);
                    $fblink = "https://www.facebook.com/groups/{$grpid}/permalink/{$postid}/";
                    mysqli_real_query($sqllink, 'INSERT INTO dnb4teh VALUES (DEFAULT, "'.$name.'", "'.$poster.'", "'.$link.'", "'.$fblink.'", "'.$date.'", "'.$type.'", "youtube", "'.$like_counter.'")');
                }
                if($content === 'link' && testName($key, 'soundcloud')) {
                    $link = $key;
                    $fblink = "https://www.facebook.com/groups/{$grpid}/permalink/{$postid}/";
                    mysqli_real_query($sqllink, 'INSERT INTO dnb4teh VALUES (DEFAULT, "'.$name.'", "'.$poster.'", "'.$link.'", "'.$fblink.'", "'.$date.'", "'.$type.'", "soundcloud", "'.$like_counter.'")');
                }
            }
        }
        $content_press = get_data($decoded_press['paging']['next']);
    }
    while(!empty($decoded_press['data']));

    echo " <pre> ";
    echo " <p>done</p>";
    echo "</pre> ";


?>
