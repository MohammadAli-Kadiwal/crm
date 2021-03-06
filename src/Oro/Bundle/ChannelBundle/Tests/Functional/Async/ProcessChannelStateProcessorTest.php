<?php
namespace Oro\Bundle\ChannelBundle\Tests\Functional\Async;

use Oro\Bundle\ChannelBundle\Async\ProcessChannelStateProcessor;
use Oro\Bundle\TestFrameworkBundle\Test\WebTestCase;

/**
 * @dbIsolationPerTest
 */
class ProcessChannelStateProcessorTest extends WebTestCase
{
    protected function setUp(): void
    {
        $this->initClient();
    }

    public function testCouldBeGetFromContainerAsService()
    {
        $processor = $this->getContainer()->get('oro_channel.async.process_channel_state_processor');

        $this->assertInstanceOf(ProcessChannelStateProcessor::class, $processor);
    }
}
