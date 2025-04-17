import React from 'react';
import { Card, CardContent } from '@mui/material';

const FamilyHealthOverview: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <div>
          <h2 className="text-lg font-bold">Family Health Overview</h2>
          <div className="pt-2 text-xs text-gray-500">
            <p>
              Family members can be added with different access levels. 
              You control what information is shared with each person.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilyHealthOverview;