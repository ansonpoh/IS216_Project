import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const GalleryTab = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = [
    { id: 'all', name: 'All Photos', count: gallery?.photos?.length },
    { id: 'events', name: 'Events', count: gallery?.photos?.filter(p => p?.category === 'events')?.length },
    { id: 'volunteers', name: 'Volunteers', count: gallery?.photos?.filter(p => p?.category === 'volunteers')?.length },
    { id: 'programs', name: 'Programs', count: gallery?.photos?.filter(p => p?.category === 'programs')?.length },
    { id: 'impact', name: 'Impact', count: gallery?.photos?.filter(p => p?.category === 'impact')?.length }
  ];

  const filteredPhotos = selectedCategory === 'all' 
    ? gallery?.photos 
    : gallery?.photos?.filter(photo => photo?.category === selectedCategory);

  const openLightbox = (photo) => {
    setLightboxImage(photo);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <Button
              key={category?.id}
              variant={selectedCategory === category?.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category?.id)}
              className="flex items-center space-x-2"
            >
              <span>{category?.name}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                selectedCategory === category?.id 
                  ? 'bg-primary-foreground text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {category?.count}
              </span>
            </Button>
          ))}
        </div>
      </div>
      {/* Featured Video */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Featured Video</h3>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
          <Image 
            src={gallery?.featuredVideo?.thumbnail} 
            alt={gallery?.featuredVideo?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Button variant="default" size="lg" iconName="Play" className="bg-white/90 text-black hover:bg-white">
              Watch Our Story
            </Button>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h4 className="text-white font-semibold mb-1">{gallery?.featuredVideo?.title}</h4>
            <p className="text-white/80 text-sm">{gallery?.featuredVideo?.description}</p>
          </div>
        </div>
      </div>
      {/* Photo Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPhotos?.map((photo) => (
          <div 
            key={photo?.id} 
            className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
            onClick={() => openLightbox(photo)}
          >
            <Image 
              src={photo?.url} 
              alt={photo?.caption}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
              <Icon 
                name="ZoomIn" 
                size={24} 
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm font-medium">{photo?.caption}</p>
              <p className="text-white/80 text-xs">{photo?.date}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Statistics */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Gallery Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {gallery?.stats?.totalPhotos}
            </div>
            <div className="text-sm text-muted-foreground">Total Photos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary mb-1">
              {gallery?.stats?.eventsDocumented}
            </div>
            <div className="text-sm text-muted-foreground">Events Documented</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {gallery?.stats?.volunteersPhotographed}
            </div>
            <div className="text-sm text-muted-foreground">Volunteers Featured</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {gallery?.stats?.storiesShared}
            </div>
            <div className="text-sm text-muted-foreground">Stories Shared</div>
          </div>
        </div>
      </div>
      {/* Upload CTA */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 text-center border border-border">
        <Icon name="Camera" size={48} className="text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Share Your Photos</h3>
        <p className="text-muted-foreground mb-6">
          Help us document our impact by sharing photos from your volunteer experience.
        </p>
        <Button variant="default" iconName="Upload" iconPosition="left">
          Upload Photos
        </Button>
      </div>
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <Image 
                src={lightboxImage?.url} 
                alt={lightboxImage?.caption}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="p-6">
                <h4 className="font-semibold text-foreground mb-2">{lightboxImage?.caption}</h4>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{lightboxImage?.date}</span>
                  <span className="capitalize">{lightboxImage?.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryTab;