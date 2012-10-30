<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\IngestionBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Helper\FormatterHelper;
use Symfony\Component\Console\Helper\DialogHelper;
use Symfony\Component\Console\Formatter\OutputFormatter;
use Symfony\Component\Console\Formatter\OutputFormatterStyle;

use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\DataBundle\Entity\Item;

/**
 * Saves an item or a set of items on the database.
 *
 */
class PersistCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */    
    protected function configure()
    {
        $this->setName('zeega:persist')
             ->setDescription('Persist a dataset in Zeega format')
             ->addOption('file_path', null, InputOption::VALUE_REQUIRED, 'Url of the item or collection to be ingested')
             ->addOption('user', null, InputOption::VALUE_REQUIRED, 'Url of the item or collection to be ingested')
             ->addOption('ingestor', null, InputOption::VALUE_REQUIRED, 'Url of the item or collection to be ingested')
             ->setHelp("Help");
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $filePath = $input->getOption('file_path');
        $userId = $input->getOption('user');
        $ingestor = $input->getOption('ingestor');
        
        if(null === $filePath || null === $userId || null === $ingestor) {
            $output->writeln('<info>Please run the operation with the --file_path, --ingestor and --user options to execute</info>');
        } else {
            $em = $this->getContainer()->get('doctrine')->getEntityManager();
            $user = $em->getRepository('ZeegaDataBundle:User')->findOneById($userId);

            $item = json_decode(file_get_contents($filePath),true);
            $items = $item["items"]; // hammer

            foreach($items as $item) {
                $item = self::parseItem($item, $user, $ingestor);
                $em->persist($item);
            }
            
            $em->flush($item);

            $output->writeln($item->getTitle());
        }
    }

    /**
     * Parses an array into an item
     *
     * @return Item
     * 
     */
    private function parseItem($itemArray, $user, $ingestor)
    {
        $title = $itemArray['title'];
        $description = $itemArray['description'];
        $text = $itemArray['text'];
        $uri = $itemArray['uri'];
        $attributionUri = $itemArray['attribution_uri'];
        $mediaType = $itemArray['media_type'];
        $layerType = $itemArray['layer_type'];
        $thumbnailUrl = $itemArray['thumbnail_url'];
        $mediaGeoLatitude = $itemArray['media_geo_latitude'];
        $mediaGeoLongitude = $itemArray['media_geo_longitude'];
        $mediaDateCreated = $itemArray['media_date_created'];
        $mediaCreatorUsername = $itemArray['media_creator_username'];
        $mediaCreatorRealname = $itemArray['media_creator_realname'];
        $archive = $itemArray['archive'];
        $attributes = $itemArray['attributes'];
        $tags = $itemArray['tags'];
        $published = $itemArray['published'];
        $childItems = $itemArray['child_items'];
            
        $item = new Item();
        $item->setDateCreated(new \DateTime("now"));
        $item->setDateUpdated(new \DateTime("now"));
        $item->setChildItemsCount(0);
        $item->setUser($user);
        $item->setIngestedBy($ingestor);
        
        if(isset($site)) $item->setSite($site); 
        if(isset($title)) $item->setTitle($title);
        if(isset($description)) $item->setDescription($description);
        if(isset($text)) $item->setText($text);
        if(isset($uri)) $item->setUri($uri);
        if(isset($attributionUri)) $item->setAttributionUri($attributionUri);
        if(isset($mediaType)) $item->setMediaType($mediaType);
        if(isset($layerType)) $item->setLayerType($layerType);
        
        if(isset($thumbnailUrl)) {
            $item->setThumbnailUrl($thumbnailUrl);
        } else {
            $thumbnailService = $this->getContainer()->get('zeega_thumbnail');
            $thumbnail = $thumbnailService->getItemThumbnail($item->getUri(), $item->getMediaType());
            
            if(null !== $thumbnail) {
                $item->setThumbnailUrl($thumbnail);
            }    
        } 
        
        if(isset($mediaGeoLatitude)) $item->setMediaGeoLatitude($mediaGeoLatitude);
        if(isset($mediaGeoLongitude)) $item->setMediaGeoLongitude($mediaGeoLongitude);
        
        if(isset($mediaDateCreated)) {
            $parsedDate = strtotime($mediaDateCreated);
            if($parsedDate) {
                $d = date("Y-m-d h:i:s",$parsedDate);
                $item->setMediaDateCreated(new \DateTime($d));
            }
        }

        if(isset($mediaCreatorUsername)) {
            $item->setMediaCreatorUsername($mediaCreatorUsername);
        }

        if(isset($mediaCreatorRealname)) {
            $item->setMediaCreatorRealname($mediaCreatorRealname);
        }
            
        if(isset($archive)) $item->setArchive($archive);
        if(isset($itemArray['location'])) $item->setLocation($itemArray['location']);
        if(isset($itemArray['license'])) $item->setLicense($itemArray['license']);
        if(isset($attributes)) $item->setAttributes($attributes);
        if(isset($tags)) $item->setTags($tags);
        if(isset($published)) $item->setPublished($published);
        
        $item->setEnabled(true);
        $item->setIndexed(false);
        $item->setPublished(false);
        
        if(isset($itemArray["child_items"])) {
            foreach($itemArray["child_items"] as $child_item) {
                $child = self::parseItem($child_item, $user, $ingestor);
                if(isset($child)) {
                    $item->addItem($child);    
                }
            }
        }

        return $item;
    }
}