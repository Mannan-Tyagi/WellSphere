import React from 'react';
import { Tabs, TabsContent } from '@components/Tabs';
import { Card, CardContent } from '@components/Card';
import { Button } from '@components/Button';

const CaregiverDashboard: React.FC = () => {
  return (
    <div>
      <Tabs>
        <TabsContent>
          <div>
            <Card>
              <CardContent>
                <div>
                  {data.map((item, index) => (
                    <div key={index}>
                      {item.isActive && (
                        <div>
                          <div>
                            <Button size="sm" className="h-7 text-xs bg-[#006D77] hover:bg-[#00585F]">
                              Schedule
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaregiverDashboard;