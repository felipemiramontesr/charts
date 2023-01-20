<?php
/* namespace created in: statistics.routing.yml -> '\Drupal\statistics\Controller\Page::createPage' 
    '\Drupal\module_name\sub_directory\class::function_name' 
*/
namespace Drupal\charts\Controller;

use Drupal\Core\Controller\ControllerBase;

/* Basic page class type; returns -> Page Title */
class pageController extends ControllerBase{
    
    /* This function is called from statistics.routing.yml -> '\Drupal\statistics\Controller\StatisticsListings::view' */
    public function createPage(){
        return [
            '#type' => 'markup',
            '#markup' => $this->t('Charts'),
        ];
    }
}

?>