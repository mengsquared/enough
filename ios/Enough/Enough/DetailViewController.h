//
//  DetailViewController.h
//  Enough
//
//  Created by Raymond Jacobson on 7/26/14.
//  Copyright (c) 2014 raymondjacobson. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface DetailViewController : UIViewController <UISplitViewControllerDelegate>

@property (strong, nonatomic) id detailItem;

@property (weak, nonatomic) IBOutlet UILabel *detailDescriptionLabel;
@end
