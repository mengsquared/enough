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

@interface ViewController : UIViewController <UITableViewDelegate, UITableViewDataSource, ABPeoplePickerNavigationControllerDelegate, UITextFieldDelegate>{
    
    IBOutlet UITableView *tableView;
    NSMutableArray *addedNumbers;
}

@property (nonatomic, strong) NSDictionary *dictContactDetails;
@property (weak, nonatomic) IBOutlet UITextField *ownPhoneField;
@property (weak, nonatomic) IBOutlet UITextField *sendPostField;

- (IBAction)addContact:(id)sender;
- (IBAction)setNumber:(id)sender;
- (IBAction)sendPost:(id)sender;
@end
