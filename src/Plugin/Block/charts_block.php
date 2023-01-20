<?php

namespace Drupal\charts\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Charts' Block.
 *
 * @Block(
 *   id = "charts-block",
 *   admin_label = @Translation("Charts block"),
 *   category = @Translation("Statistics charts"),
 * )
 */

class charts_block extends BlockBase {
     /**s
     * {@inheritdoc}
     */
    public function build() {

        $renderable = [
            '#theme' => 'charts',
            '#label' => 'charts',
            '#data' =>  'Charts',
        ];

        return $renderable;
    }

    public function getCacheMaxAge() {
        return 0;
    }
}
