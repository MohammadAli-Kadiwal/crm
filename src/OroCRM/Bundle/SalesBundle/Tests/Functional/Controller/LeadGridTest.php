<?php

namespace OroCRM\Bundle\SalesBundle\Tests\Functional\Controller;

use OroCRM\Bundle\SalesBundle\Tests\Functional\Fixture\LoadSalesBundleFixtures;

/**
 * @outputBuffering enabled
 * @dbIsolation
 */
class LeadGridTest extends AbstractController
{
    /**
     * @return array
     */
    public function gridProvider()
    {
        return [
            'Lead grid' => [
                [
                    'gridParameters'      => [
                        'gridName' => 'sales-lead-grid'
                    ],
                    'gridFilters'         => [],
                    'assert'              => [
                        'name'        => 'Lead name',
                        'channelName' => LoadSalesBundleFixtures::CHANNEL_NAME,
                        'firstName'   => 'fname',
                        'lastName'    => 'lname',
                        'email'       => 'email@email.com'
                    ],
                    'expectedResultCount' => 1
                ],
            ],
            'Lead grid with filters' => [
                [
                    'gridParameters'      => [
                        'gridName' => 'sales-lead-grid'
                    ],
                    'gridFilters'         => [
                        'sales-lead-grid[_filter][channelName][value]'  => 'b2b Channel',
                        'sales-lead-grid[_filter][name][value]'  => 'Lead name',
                    ],
                    'assert'              => [
                        'name'        => 'Lead name',
                        'channelName' => LoadSalesBundleFixtures::CHANNEL_NAME,
                        'firstName'   => 'fname',
                        'lastName'    => 'lname',
                        'email'       => 'email@email.com'
                    ],
                    'expectedResultCount' => 1
                ],
            ],
            'Lead grid without result' => [
                [
                    'gridParameters'      => [
                        'gridName' => 'sales-lead-grid'
                    ],
                    'gridFilters'         => [
                        'sales-lead-grid[_filter][channelName][value]'  => 'b2b Channel',
                        'sales-lead-grid[_filter][name][value]'  => 'some name',
                    ],
                    'assert'              => [
                        'name'        => 'Lead name',
                        'channelName' => LoadSalesBundleFixtures::CHANNEL_NAME,
                        'firstName'   => 'fname',
                        'lastName'    => 'lname',
                        'email'       => 'email@email.com'
                    ],
                    'expectedResultCount' => 0
                ],
            ],
        ];
    }
}
