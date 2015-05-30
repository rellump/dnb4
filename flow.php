<?php
    include('db.php');

    $search_string = preg_replace("/[^A-Za-z0-9]/", " ", $_POST['query']);
    $search_string = $sqllink->real_escape_string($search_string);

    if (strlen($search_string) >= 1 && $search_string !== ' ') {

        $query = mysqli_query($sqllink, 'SELECT * FROM dnb4teh WHERE (Name LIKE "%'.$search_string.'%" OR Poster LIKE "%'.$search_string.'%") AND gruppe="flow" ORDER BY datum DESC');

        while($temp = mysqli_fetch_array($query)) {
            echo "<div class='trackframes round' id='".$temp['ID']."' data-fbgroup='".$temp['gruppe']."' data-trackname='".$temp['Name']."' data-fbposter='".$temp['Poster']."' data-fbdate='".$temp['datum']."'>";
            echo "        <a href='".$temp['link']."' target='_blank' class='linkpic'>";
            echo "                <img class='round pic' src='img/".$temp['type']."-icon.png'>";
            echo "        </a>";
            echo "        <div class='click-load' data-link='".$temp['link']."' data-type='".$temp['type']."'>";
            echo "                <div class='round link-description-title'>".$temp['Name']."</div>";
            echo "                <div class='round link-description-number'>".$temp['gruppe']." |  ".$temp['Poster']."  |  ".$temp['datum']."</div>";
            echo "        </div>";
            echo "      <a href='".$temp['fb-link']."' target='_blank' class='linkfb'>";
            echo "                <img class='round pic' src='img/Facebook_icon_2013.svg'>";
            echo "        </a>";
            echo "</div>";
        };
    } else if (strlen($search_string) == 0) {

        $query = mysqli_query($sqllink, 'SELECT * FROM dnb4teh WHERE gruppe="flow" ORDER BY datum DESC');

        while ($temp = mysqli_fetch_array($query)) {
            echo "<div class='trackframes round' id='".$temp['ID']."' data-fbgroup='".$temp['gruppe']."' data-trackname='".$temp['Name']."' data-fbposter='".$temp['Poster']."' data-fbdate='".$temp['datum']."'>";
            echo "        <a href='".$temp['link']."' target='_blank' class='linkpic'>";
            echo "                <img class='round pic' src='img/".$temp['type']."-icon.png'>";
            echo "        </a>";
            echo "        <div class='click-load' data-link='".$temp['link']."' data-type='".$temp['type']."'>";
            echo "                <div class='round link-description-title'>".$temp['Name']."</div>";
            echo "                <div class='round link-description-number'>".$temp['gruppe']." |  ".$temp['Poster']."  |  ".$temp['datum']."</div>";
            echo "        </div>";
            echo "      <a href='".$temp['fb-link']."' target='_blank' class='linkfb'>";
            echo "                <img class='round pic' src='img/Facebook_icon_2013.svg'>";
            echo "        </a>";
            echo "</div>";
        };
    };
?>