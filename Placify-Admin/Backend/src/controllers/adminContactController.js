// Contact management for admin panel
const Contact = require('../models/Contact');
const adminRepository = require('../repositories/adminRepository');

class AdminContactController {
  // Get all contact submissions
  async getContacts(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status,
        sortBy = 'date',
        sortOrder = 'desc'
      } = req.query;

      const skip = (page - 1) * limit;
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const filter = {};
      if (status) {
        if (status === 'new') {
          filter.$or = [{ status: 'new' }, { status: { $exists: false } }];
        } else {
          filter.status = status;
        }
      }

      const contacts = await Contact
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('assignedTo', 'username')
        .populate('respondedBy', 'username')
        .lean();

      // Add virtual fields to each contact
      const contactsWithVirtuals = contacts.map(contact => ({
        ...contact,
        status: contact.status || 'new', // Default to 'new' for contacts without status
        extractedSubject: contact.subject || (contact.message && contact.message.startsWith('Subject:') 
          ? contact.message.split('\n')[0].replace('Subject:', '').trim() || 'No subject'
          : 'No subject'),
        cleanMessage: contact.message && contact.message.startsWith('Subject:')
          ? contact.message.split('\n').slice(2).join('\n').trim()
          : contact.message
      }));

      const total = await Contact.countDocuments(filter);

      // Log admin action
      await adminRepository.logAction({
        adminId: req.adminId,
        action: 'VIEW_CONTACTS',
        resourceType: 'Contact',
        details: { 
          page: parseInt(page), 
          limit: parseInt(limit),
          status: status || 'all'
        }
      });

      res.status(200).json({
        success: true,
        contacts: contactsWithVirtuals,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: contactsWithVirtuals.length,
          totalRecords: total
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get contact by ID
  async getContact(req, res, next) {
    try {
      const { id } = req.params;

      const contact = await Contact.findById(id);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      // Log admin action
      await adminRepository.logAction({
        adminId: req.adminId,
        action: 'VIEW_CONTACT',
        resourceType: 'Contact',
        resourceId: id,
        details: { viewedAt: new Date() }
      });

      res.status(200).json({
        success: true,
        contact
      });

    } catch (error) {
      next(error);
    }
  }

  // Update contact status
  async updateContactStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const contact = await Contact.findByIdAndUpdate(
        id,
        { 
          status,
          assignedTo: req.adminId,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      // Log admin action
      await adminRepository.logAction({
        adminId: req.adminId,
        action: 'UPDATE_CONTACT_STATUS',
        resourceType: 'Contact',
        resourceId: id,
        details: { newStatus: status },
        previousData: { status: contact.status },
        newData: { status }
      });

      res.status(200).json({
        success: true,
        contact,
        message: 'Contact status updated successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  // Add response to contact
  async respondToContact(req, res, next) {
    try {
      const { id } = req.params;
      const { response } = req.body;

      const contact = await Contact.findByIdAndUpdate(
        id,
        {
          response: response.trim(),
          respondedBy: req.adminId,
          respondedAt: new Date(),
          status: 'resolved'
        },
        { new: true, runValidators: true }
      );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      // Log admin action
      await adminRepository.logAction({
        adminId: req.adminId,
        action: 'RESPOND_TO_CONTACT',
        resourceType: 'Contact',
        resourceId: id,
        details: { responseLength: response.length },
        newData: { hasResponse: true, status: 'resolved' }
      });

      res.status(200).json({
        success: true,
        contact,
        message: 'Response added successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  // Get contact statistics
  async getContactStats(req, res, next) {
    try {
      const [
        totalContacts,
        newCount,
        inProgressCount,
        resolvedCount,
        closedCount,
        recentContacts
      ] = await Promise.all([
        Contact.countDocuments(),
        Contact.countDocuments({ $or: [{ status: 'new' }, { status: { $exists: false } }] }),
        Contact.countDocuments({ status: 'in-progress' }),
        Contact.countDocuments({ status: 'resolved' }),
        Contact.countDocuments({ status: 'closed' }),
        Contact.find()
          .sort({ date: -1 })
          .limit(5)
          .select('name email subject date status')
          .lean()
      ]);

      res.status(200).json({
        success: true,
        stats: {
          total: totalContacts,
          new: newCount,
          inProgress: inProgressCount,
          resolved: resolvedCount,
          closed: closedCount
        },
        recentContacts
      });

    } catch (error) {
      next(error);
    }
  }

  // Update contact details (priority, category, tags, notes)
  async updateContactDetails(req, res, next) {
    try {
      const { id } = req.params;
      const { priority, category, tags, notes } = req.body;

      const updateData = {};
      if (priority) updateData.priority = priority;
      if (category) updateData.category = category;
      if (tags !== undefined) updateData.tags = tags;
      if (notes !== undefined) updateData.notes = notes;

      const contact = await Contact.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      // Log admin action
      await adminRepository.logAction({
        adminId: req.adminId,
        action: 'UPDATE_CONTACT_DETAILS',
        resourceType: 'Contact',
        resourceId: id,
        details: { fieldsUpdated: Object.keys(updateData) },
        newData: updateData
      });

      res.status(200).json({
        success: true,
        contact,
        message: 'Contact details updated successfully'
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminContactController();