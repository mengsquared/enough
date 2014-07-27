//
//  ViewController.h
//  Enough
//
//  Created by Raymond Jacobson on 7/26/14.
//  Copyright (c) 2014 raymondjacobson. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AddressBook/AddressBook.h>
#import <AddressBookUI/AddressBookUI.h>

@interface ViewController : UIViewController <UITableViewDelegate, UITableViewDataSource, ABPeoplePickerNavigationControllerDelegate>


@property (nonatomic, strong) NSDictionary *dictContactDetails;

-(IBAction)addContact:(id)sender;
@end
