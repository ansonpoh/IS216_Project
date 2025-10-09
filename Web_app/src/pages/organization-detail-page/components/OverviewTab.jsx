import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const OverviewTab = ({ organization }) => {
  return (
    <div className="space-y-8">
      {/* Mission & Vision */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-4">Our Mission</h3>
        <p className="text-muted-foreground leading-relaxed mb-6">
          {organization?.detailedMission}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-2 flex items-center">
              <Icon name="Target" size={18} className="mr-2 text-primary" />
              Our Vision
            </h4>
            <p className="text-sm text-muted-foreground">
              {organization?.vision}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-2 flex items-center">
              <Icon name="Heart" size={18} className="mr-2 text-secondary" />
              Our Values
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {organization?.values?.map((value, index) => (
                <li key={index} className="flex items-center">
                  <Icon name="Check" size={14} className="mr-2 text-success" />
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Key Programs */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Key Programs</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organization?.programs?.map((program, index) => (
            <div key={index} className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <Icon name={program?.icon} size={20} className="text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">{program?.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {program?.description}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Icon name="Users" size={12} className="mr-1" />
                <span>{program?.participants} participants</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Leadership Team */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Leadership Team</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {organization?.leadership?.map((leader, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                <Image 
                  src={leader?.photo} 
                  alt={leader?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-foreground">{leader?.name}</h4>
              <p className="text-sm text-primary mb-2">{leader?.position}</p>
              <p className="text-xs text-muted-foreground">
                {leader?.experience}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Recognition & Awards */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Recognition & Awards</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {organization?.awards?.map((award, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Award" size={24} className="text-warning" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{award?.title}</h4>
                <p className="text-sm text-muted-foreground mb-1">{award?.organization}</p>
                <p className="text-xs text-muted-foreground">{award?.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;